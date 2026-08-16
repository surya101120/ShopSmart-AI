"""add role to usere

Revision ID: a7d7e44dc10e
Revises: 293b268293bf
Create Date: 2026-08-14 22:26:20.074617

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7d7e44dc10e'
down_revision = '293b268293bf'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'users',
        sa.Column('role', sa.String(length=20), nullable=True)
    )


def downgrade():
    op.drop_column('users', 'role')
