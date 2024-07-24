from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import uuid
from datetime import datetime
from flask_migrate import Migrate


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class TestCase(db.Model):

    __tablename__ = 'testcase'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_case_name = db.Column(db.String(255), nullable=False)
    estimated_time = db.Column(db.Text)
    module = db.Column(db.String(50))
    priority = db.Column(db.String(50))
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def json(self):
        return {
            'id': str(self.id),
            'test_case_name': self.test_case_name,
            'estimated_time': self.estimated_time,
            'module': self.module,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Create a new test case
@app.route('/testcase', methods=['POST'])
def create_test_case():
    data = request.get_json()
    new_test_case = TestCase(
        test_case_name=data['test_case_name'],
        estimated_time=data.get('estimated_time'),
        module=data.get('module'),
        priority=data.get('priority'),
        status=data.get('status')
    )
    db.session.add(new_test_case)
    db.session.commit()
    return jsonify(new_test_case.json()), 201


# Get all test cases
@app.route('/testcase', methods=['GET'])
def get_test_cases():
    test_cases = TestCase.query.all()
    return jsonify([test_case.json() for test_case in test_cases]), 200


# Update an existing test case
@app.route('/testcase/<uuid:test_case_id>', methods=['PUT'])
def update_test_case(test_case_id):
    data = request.get_json()
    test_case = TestCase.query.get_or_404(test_case_id)

    test_case.test_case_name = data.get('test_case_name', test_case.test_case_name)
    test_case.estimated_time = data.get('estimated_time', test_case.estimated_time)
    test_case.module = data.get('module', test_case.module)
    test_case.priority = data.get('priority', test_case.priority)
    test_case.status = data.get('status', test_case.status)

    db.session.commit()
    return jsonify(test_case.json()), 200


#create a test route
@app.route('/test', methods=['GET'])
def test():
    response = jsonify(message="Hello from Flask!")
    return response

if __name__ == '__main__':
    app.run(debug=True)
