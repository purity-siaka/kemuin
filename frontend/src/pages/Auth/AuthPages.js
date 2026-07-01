import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = '/feed';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome to KEMU Alumni Network</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

const schoolDepartmentMap = {
  'School of Medicine and Health Sciences': [
    'Department of Pharmacy',
    'Department of Health Systems Management',
    'Department of Nursing',
    'Department of Medical Laboratory Sciences',
    'Department of Public Health, Human Nutrition and Dietetics',
    'Department of Clinical Medicine and Community Health',
    'Department of Human Anatomy',
    'Department of Medical Biochemistry',
    'Department of Microbiology and Parasitology',
    'Department of Reproductive Health',
    'Department of Psychiatry'
  ],
  'School of Business and Economics': [
    'Department of Business Administration',
    'Department of Accounting and Finance',
    'Department of Economics'
  ],
  'School of Science and Technology': [
    'Department of Computer Science',
    'Department of Information Science',
    'Department of Agriculture and Natural Resources',
    'Department of Pure and Applied Sciences'
  ],
  'School of Education and Social Sciences': [
    'Department of Education',
    'Department of Theology, Religious Studies, and Counseling',
    'Department of Communication and Journalism'
  ]
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    graduationYear: '',
    school: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'school') {
      setFormData({ ...formData, school: value, department: '' });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await register(formData);
      if (response.requiresApproval) {
        setMessage('Registration received. Your account is pending admin approval.');
      } else {
        window.location.href = '/feed';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Join KEMU Alumni Network</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Graduation Year</label>
              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              >
                <option value="">Select graduation year</option>
                {Array.from({ length: 191 }, (_, i) => 1900 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>School</label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
              >
                <option value="">Select school</option>
                {Object.keys(schoolDepartmentMap).map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={!formData.school}
            >
              <option value="">Select department</option>
              {formData.school &&
                schoolDepartmentMap[formData.school].map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="auth-success-message">{message}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export { Login, Register };
