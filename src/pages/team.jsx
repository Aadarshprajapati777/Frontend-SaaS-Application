import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, UserPlus, MoreHorizontal, Trash2, UserCheck, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/auth-utils';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { formatDate } from '../lib/utils';

const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
};

const ROLE_BADGES = {
  [ROLES.OWNER]: 'bg-indigo-100 text-indigo-800',
  [ROLES.ADMIN]: 'bg-blue-100 text-blue-800',
  [ROLES.MEMBER]: 'bg-green-100 text-green-800',
  [ROLES.VIEWER]: 'bg-gray-100 text-gray-800'
};

/**
 * Team Management Page
 * 
 * Allows business users to manage their team members, send invites,
 * and control permissions
 */
export default function TeamManagementPage() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(ROLES.MEMBER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock team members data
  const mockTeamMembers = useMemo(() => [
    {
      id: '1',
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      role: 'Admin',
      status: 'active',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      dateAdded: '2023-08-15T14:30:00Z',
      lastActive: '2023-10-01T09:15:30Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: ROLES.ADMIN,
      status: 'active',
      dateJoined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael@company.com',
      role: ROLES.MEMBER,
      status: 'active',
      dateJoined: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: null,
      email: 'pending@company.com',
      role: ROLES.VIEWER,
      status: 'pending',
      dateJoined: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: null,
    }
  ], []);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        // In a production app, this would use the real API
        // const response = await teamAPI.getTeamMembers();
        // setTeamMembers(response.data);
        
        // For now, simulate API delay with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTeamMembers(mockTeamMembers);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setError('Failed to load team members. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user, mockTeamMembers]);

  // Toggle dropdown menu for a team member
  const toggleDropdown = (memberId) => {
    if (activeDropdown === memberId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(memberId);
    }
  };

  // Handle inviting a new team member
  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a production app, this would call the real API
      // await teamAPI.inviteTeamMember({ email: inviteEmail, role: inviteRole });
      
      // For demo purposes, add the new invite to the local state
      const newMember = {
        id: `temp-${Date.now()}`,
        name: null,
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        dateJoined: new Date().toISOString(),
        lastActive: null
      };
      
      setTeamMembers((prev) => [...prev, newMember]);
      setInviteEmail('');
      
      // Show success message (in a real app, use a toast notification)
      console.log(`Invitation sent to ${inviteEmail}`);
    } catch (err) {
      console.error('Failed to send invite:', err);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle changing a team member's role
  const handleRoleChange = async (memberId, newRole) => {
    try {
      // Close the dropdown
      setActiveDropdown(null);
      
      // In a production app, call the API
      // await teamAPI.updateMemberRole(memberId, { role: newRole });
      
      // Update local state
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      
      // Show success message
      console.log(`Changed role for member ${memberId} to ${newRole}`);
    } catch (err) {
      console.error('Failed to update role:', err);
      // Show error message
    }
  };

  // Handle removing a team member
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        // Close the dropdown
        setActiveDropdown(null);
        
        // In a production app, call the API
        // await teamAPI.removeTeamMember(memberId);
        
        // Update local state
        setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
        
        // Show success message
        console.log(`Removed team member ${memberId}`);
      } catch (err) {
        console.error('Failed to remove team member:', err);
        // Show error message
      }
    }
  };

  // Calculate team limits based on plan
  const getPlanLimits = () => {
    // These would come from the user's plan data in a real app
    switch (user?.plan) {
      case 'starter':
        return { members: 5, current: teamMembers.length };
      case 'professional':
        return { members: 15, current: teamMembers.length };
      case 'enterprise':
        return { members: 'Unlimited', current: teamMembers.length };
      default:
        return { members: 3, current: teamMembers.length };
    }
  };

  const planLimits = getPlanLimits();
  const canAddMoreMembers = typeof planLimits.members === 'string' || planLimits.current < planLimits.members;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="mt-1 text-gray-600">
              Invite and manage your team members
            </p>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium">
              {planLimits.current} / {planLimits.members} Members
            </span>
          </div>
        </div>
      </div>

      {/* Team members and invitation form */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Team members list */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-500">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                {member.name ? (
                                  member.name.charAt(0).toUpperCase()
                                ) : (
                                  <Mail className="h-5 w-5" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {member.name || 'Pending Invitation'}
                                </div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              member.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${ROLE_BADGES[member.role]}`}>
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.lastActive ? formatDate(member.lastActive) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Don't show actions for owner */}
                            {member.role !== ROLES.OWNER && (
                              <div className="relative">
                                <button
                                  onClick={() => toggleDropdown(member.id)}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                                {activeDropdown === member.id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                      {/* Role change options */}
                                      <div className="px-4 py-2 text-xs text-gray-500">Change Role</div>
                                      {Object.values(ROLES).map((role) => (
                                        role !== ROLES.OWNER && (
                                          <button
                                            key={role}
                                            onClick={() => handleRoleChange(member.id, role)}
                                            className={`block w-full text-left px-4 py-2 text-sm ${
                                              role === member.role
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                          >
                                            <span className="capitalize">{role}</span>
                                            {role === member.role && (
                                              <UserCheck className="h-4 w-4 ml-2 inline" />
                                            )}
                                          </button>
                                        )
                                      ))}
                                      <div className="border-t border-gray-100 my-1"></div>
                                      {/* Remove option */}
                                      <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2 inline" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {teamMembers.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No team members found. Invite some!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Invite form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Invite Team Member</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!canAddMoreMembers ? (
                <div className="text-center py-4">
                  <Shield className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 font-medium mb-1">Team Limit Reached</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    You've reached the maximum number of team members for your plan.
                  </p>
                  <Link to="/billing">
                    <Button>Upgrade Plan</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      disabled={isSubmitting}
                    >
                      <option value={ROLES.MEMBER}>Member (Edit)</option>
                      <option value={ROLES.VIEWER}>Viewer (Read-only)</option>
                      <option value={ROLES.ADMIN}>Admin (Full Access)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      {inviteRole === ROLES.MEMBER && "Can upload documents and use models"}
                      {inviteRole === ROLES.VIEWER && "Can only view documents and chat logs"}
                      {inviteRole === ROLES.ADMIN && "Full access to all features including billing"}
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !inviteEmail.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⋯</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* Role permissions info card */}
          <Card className="mt-4">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Owner:</span>
                  <p className="text-gray-500">Full access, billing, can delete account</p>
                </div>
                <div>
                  <span className="font-medium">Admin:</span>
                  <p className="text-gray-500">Full access to features, manage team, billing</p>
                </div>
                <div>
                  <span className="font-medium">Member:</span>
                  <p className="text-gray-500">Upload documents, create models, chat</p>
                </div>
                <div>
                  <span className="font-medium">Viewer:</span>
                  <p className="text-gray-500">Read-only access to documents and models</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 