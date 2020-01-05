from app import db
# from sqlalchemy.dialects.postgresql import JSON


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON)
    status_id = db.Column(db.Integer)

    def __repr__(self):
        return '<Project {}>'.format(self.name)


class ProjectStatus(db.Model):
    __tablename__ = 'project_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return '<ProjectStatus {}>'.format(self.name)


class Launch(db.Model):
    __tablename__ = 'launches'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON)
    status_id = db.Column(db.Integer)

    def __repr__(self):
        return '<Launch {}>'.format(self.name)


class Test(db.Model):
    __tablename__ = 'tests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON)
    start_datetime = db.Column(db.DateTime, nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('test_status.id'),
        nullable=False)
    status = db.relationship('Status',
        backref=db.backref('test_status', lazy=True))
    resolution_id = db.Column(db.Integer, db.ForeignKey('test_resolution.id'),
        nullable=False)
    resolution = db.relationship('Resolution',
        backref=db.backref('test_resolution', lazy=True))

    def __repr__(self):
        return '<Test {}>'.format(self.name)


class TestStatus(db.Model):
    __tablename__ = 'test_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return '<TestStatus {}>'.format(self.name)


class TestResolution(db.Model):
    __tablename__ = 'test_resolution'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())

    def __repr__(self):
        return '<TestResolution {}>'.format(self.name)


class TestSuite(db.Model):
    __tablename__ = 'test_suites'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.JSON)
    start_datetime = db.Column(db.DateTime, nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False)
    status_id = db.Column(db.Integer)
    test_type_id = db.Column(db.Integer, db.ForeignKey('test_type.id'),
        nullable=False)
    test_type = db.relationship('TestType',
        backref=db.backref('test_type', lazy=True))
    test_suite_status_id = db.Column(db.Integer, db.ForeignKey('test_suite_status.id'),
        nullable=False)
    test_suite_status = db.relationship('TestSuiteStatus',
        backref=db.backref('test_suite_status', lazy=True))


class TestType(db.Model):
    __tablename__ = 'test_type'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())

    def __repr__(self):
        return '<TestType {}>'.format(self.name)


class TestSuiteStatus(db.Model):
    __tablename__ = 'test_suite_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())

    def __repr__(self):
        return '<TestSuiteStatus {}>'.format(self.name)
