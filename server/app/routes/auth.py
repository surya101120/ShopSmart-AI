import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, get_jwt
)
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip()
    password = data.get('password', '')

    if not email or not name or not password:
        return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    user.generate_verify_token()
    user.phone = data.get('phone')

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id), additional_claims={'role': 'user', 'name': user.name})
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'success': False, 'message': 'Account is deactivated'}), 403

    user.last_login = datetime.datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role, 'name': user.name})
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'role': user.role,
            'name': user.name
        }
    )

    return jsonify({
        'success': True,
        'message': 'Token refreshed successfully',
        'access_token': access_token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    return jsonify({'success': True, 'user': user.to_dict()}), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        user.name = data['name'].strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'avatar_url' in data:
        user.avatar_url = data['avatar_url'].strip()

    db.session.commit()
    return jsonify({'success': True, 'message': 'Profile updated', 'user': user.to_dict()}), 200


@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404

    data = request.get_json() or {}

    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    if not current_password or not new_password:
        return jsonify({
            'success': False,
            'message': 'Current password and new password are required'
        }), 400

    if not user.check_password(current_password):
        return jsonify({
            'success': False,
            'message': 'Current password is incorrect'
        }), 401

    user.set_password(new_password)

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Password changed successfully'
    }), 200

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    user = User.query.filter_by(email_verify_token=token).first()

    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid verification token'
        }), 400

    user.is_email_verified = True
    user.email_verify_token = None

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Email verified successfully'
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}

    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({
            'success': False,
            'message': 'Email is required'
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404

    token = user.generate_reset_token()

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Password reset token generated',
        'reset_token': token
    }), 200

@auth_bp.route('/reset-password/<token>', methods=['PUT'])
def reset_password(token):
    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid or expired reset token'
        }), 400

    if not user.is_reset_token_valid(token):
        return jsonify({
            'success': False,
            'message': 'Invalid or expired reset token'
        }), 400

    data = request.get_json() or {}

    new_password = data.get('new_password', '')

    if not new_password:
        return jsonify({
            'success': False,
            'message': 'New password is required'
        }), 400

    user.set_password(new_password)

    user.reset_token = None
    user.reset_token_expires = None

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Password reset successfully'
    }), 200