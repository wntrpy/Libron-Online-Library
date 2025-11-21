// frontend/src/pages/member/MyAccount.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, Mail, Phone, MapPin, User, BookOpen, Calendar, LogOut } from 'lucide-react';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';

export default function MyAccount() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    student_number: '',
    first_name: '',
    last_name: '',
    phone: '',
    college: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadUserData = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        setFormData({
          student_number: storedUser.student_number || '',
          first_name: storedUser.first_name || '',
          last_name: storedUser.last_name || '',
          phone: storedUser.phone || '',
          college: storedUser.college || '',
          address: storedUser.address || ''
        });
      }
      setLoading(false);
    } catch {
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  useEffect(() => {
     
    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`http://localhost:8000/api/members/member/${user.member_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedMember = await response.json();
        const updatedUser = { ...user, ...updatedMember };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <MemberHeader />
        <main className="w-full min-h-screen bg-white pt-24">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <MemberFooter />
      </>
    );
  }

  return (
    <>
      <MemberHeader />
      <main className="w-full min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your profile information</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-12">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                  <User className="w-10 h-10 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formData.first_name && formData.last_name
                      ? `${formData.first_name} ${formData.last_name}`
                      : formData.username}
                  </h2>
                  <p className="text-gray-700">@{formData.username}</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Number - Read Only */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Student Number
                      </label>
                      <input
                        type="text"
                        value={formData.student_number}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        placeholder="Student number"
                      />
                    </div>

                    {/* College/Department - Read Only */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        College/Department
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        placeholder="College/department"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter address"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Student Number */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Student Number</p>
                        <p className="text-lg font-semibold text-gray-900">{formData.student_number || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* College/Department */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">College/Department</p>
                        <p className="text-lg font-semibold text-gray-900">{formData.college || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* First Name */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">First Name</p>
                        <p className="text-lg font-semibold text-gray-900">{formData.first_name || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pink-100 rounded-lg">
                        <User className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Last Name</p>
                        <p className="text-lg font-semibold text-gray-900">{formData.last_name || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Mail className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{user?.email || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">{formData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium">Address</p>
                        <p className="text-gray-900 mt-1">{formData.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Member Since */}
                  {user?.date_joined && (
                    <div className="pt-8 border-t">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                          <Calendar className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Member since {new Date(user.date_joined).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit and Logout Buttons */}
                  <div className="pt-6 flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <MemberFooter />
    </>
  );
}