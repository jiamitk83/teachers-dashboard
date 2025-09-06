import React, { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'class' | 'meeting' | 'exam' | 'holiday';
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Math Class',
      date: '2024-09-15',
      type: 'class'
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      date: '2024-09-16',
      type: 'meeting'
    },
    {
      id: '3',
      title: 'Science Exam',
      date: '2024-09-18',
      type: 'exam'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'class' as 'class' | 'meeting' | 'exam' | 'holiday'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', date: '', type: 'class' });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'primary';
      case 'meeting': return 'info';
      case 'exam': return 'danger';
      case 'holiday': return 'success';
      default: return 'secondary';
    }
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const todayEvents = getEventsForDate(formatDate(new Date()));

  return (
    <div>
      <h1 className="mb-4">Calendar</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Calendar View</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <h4>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
              </div>

              {/* Simple calendar grid - in a real app, you'd use a proper calendar library */}
              <div className="calendar-grid">
                <div className="calendar-header">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="calendar-body">
                  {/* This is a simplified calendar - you'd need proper date calculations */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1);
                    const dateStr = formatDate(date);
                    const dayEvents = getEventsForDate(dateStr);

                    return (
                      <div key={i} className={`calendar-day ${date.getMonth() === currentDate.getMonth() ? 'current-month' : 'other-month'}`}>
                        <div className="day-number">{date.getDate()}</div>
                        {dayEvents.map(event => (
                          <div key={event.id} className={`event-badge bg-${getEventTypeColor(event.type)}`}>
                            {event.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Today's Events</h5>
            </div>
            <div className="card-body">
              {todayEvents.length > 0 ? (
                todayEvents.map(event => (
                  <div key={event.id} className="mb-2">
                    <span className={`badge bg-${getEventTypeColor(event.type)} me-2`}>
                      {event.type}
                    </span>
                    {event.title}
                  </div>
                ))
              ) : (
                <p className="text-muted">No events today</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Add Event</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    className="form-control"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'class' | 'meeting' | 'exam' | 'holiday' })}
                  >
                    <option value="class">Class</option>
                    <option value="meeting">Meeting</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100" type="submit">Add Event</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Calendar;