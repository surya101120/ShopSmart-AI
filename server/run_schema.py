from pathlib import Path
import pymysql
from config import get_config
from sqlalchemy.engine.url import make_url

# Load configuration
config = get_config()

# Parse database URL
url = make_url(config.SQLALCHEMY_DATABASE_URI)

print("HOST:", url.host)
print("DATABASE:", url.database)

# Connect to MySQL
conn = pymysql.connect(
    host=url.host,
    port=url.port or 3306,
    user=url.username,
    password=url.password,
    database=url.database,
    ssl={"ca": config.SSL_CA} if getattr(config, "SSL_CA", None) else None,
    autocommit=True
)

# Find schema.sql
schema_path = Path(__file__).resolve().parent.parent / "database" / "schema.sql"

print("SCHEMA:", schema_path)

sql = schema_path.read_text(encoding="utf-8")

# Remove database creation/use commands
clean_lines = []

for line in sql.splitlines():

    stripped = line.strip()

    if stripped.upper().startswith("CREATE DATABASE"):
        continue

    if stripped.upper().startswith("CHARACTER SET"):
        continue

    if stripped.upper().startswith("COLLATE"):
        continue

    if stripped.upper().startswith("USE shopsmart_ai"):
        continue

    clean_lines.append(line)

sql = "\n".join(clean_lines)

# -------------------------------------------------
# Split SQL while respecting DELIMITER commands
# -------------------------------------------------

statements = []
buffer = []
delimiter = ";"

for line in sql.splitlines():

    stripped = line.strip()

    # Change delimiter
    if stripped.upper().startswith("DELIMITER "):

        delimiter = stripped.split(maxsplit=1)[1]

        continue

    buffer.append(line)

    # Check whether current statement is complete
    if stripped.endswith(delimiter):

        statement = "\n".join(buffer).strip()

        statement = statement[:-len(delimiter)].strip()

        if statement:
            statements.append(statement)

        buffer = []

# -------------------------------------------------
# Execute statements
# -------------------------------------------------

try:

    with conn.cursor() as cur:

        for i, statement in enumerate(statements, 1):

            try:

                cur.execute(statement)

                print(f"OK: statement {i}")

            except Exception as e:

                print()
                print("=" * 60)
                print(f"ERROR: statement {i}")
                print("=" * 60)

                print(e)

                print()
                print("SQL:")
                print(statement[:1000])

                raise

    print()
    print("=" * 60)
    print("SCHEMA COMPLETE!")
    print("=" * 60)

finally:

    conn.close()