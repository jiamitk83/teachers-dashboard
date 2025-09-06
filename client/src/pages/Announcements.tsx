import React, { useState, useEffect, FormEvent } from 'react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    // Mock data for announcements (in a real app, this would come from the server)
    const mockAnnouncements: Announcement[] = [
      {
        _id: '1',
        title: 'Welcome Back!',
        content: 'Welcome back to school! We hope you had a great summer break.',
        date: new Date().toISOString(),
        priority: 'high'
      },
      {
        _id: '2',
        title: 'Parent-Teacher Conference',
        content: 'Parent-teacher conferences will be held next week. Please schedule your appointment.',
        date: new Date().toISOString(),
        priority: 'medium'
      }
    ];
    setAnnouncements(mockAnnouncements);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    const announcement: Announcement = {
      _id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date().toISOString(),
      priority: newAnnouncement.priority
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', priority: 'medium' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <h1 className="mb-4">Announcements</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create New Announcement</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Announcement Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={4}
                placeholder="Announcement Content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Post Announcement</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          Recent Announcements
        </div>
        <div className="list-group list-group-flush">
          {announcements.length > 0 ? (
            announcements.map((announcement: Announcement) => (
              <div key={announcement._id} className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{announcement.title}</h5>
                  <small className={`badge bg-${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </small>
                </div>
                <p className="mb-1">{announcement.content}</p>
                <small className="text-muted">
                  {new Date(announcement.date).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <div className="list-group-item">No announcements yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
