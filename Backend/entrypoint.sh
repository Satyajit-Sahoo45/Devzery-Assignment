#!/bin/sh



# Run migrations

flask db init

flask db migrate

flask db upgrade

# Start Flask app
exec flask run --host=0.0.0.0 --port=5000
