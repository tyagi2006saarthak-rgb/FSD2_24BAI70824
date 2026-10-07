import { useEffect, useMemo, useState } from 'react';
import './App.css';

const priorityOrder = { high: 3, medium: 2, low: 1 };
const todayISO = new Date().toISOString().slice(0, 10);

const formatDateString = (value) => {
  if (!value) return 'No date';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState(todayISO);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [monthCursor, setMonthCursor] = useState(new Date(`${todayISO}T00:00:00`));
  const pageSize = 8;

  const API_URL = 'http://localhost:8080/api/tasks';

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?page=${page}&size=${pageSize}&sort=id,desc`);
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      setTasks(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const normalizedTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate || todayISO,
        priority: task.priority || 'medium'
      })),
    [tasks]
  );

  const taskMap = useMemo(() => {
    const map = new Map();
    normalizedTasks.forEach((task) => {
      const key = task.dueDate || todayISO;
      const current = map.get(key) || [];
      current.push(task);
      map.set(key, current);
    });
    return map;
  }, [normalizedTasks]);

  const visibleTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...normalizedTasks]
      .filter((task) => {
        const matchesSearch = !query || task.title.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        if (filter === 'all') return true;
        if (filter === 'done') return task.completed;
        if (filter === 'pending') return !task.completed;
        if (filter === 'today') return task.dueDate === todayISO;
        if (filter === 'upcoming') return task.dueDate >= todayISO && !task.completed;
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        const priorityDifference = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (priorityDifference !== 0) return priorityDifference;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }, [normalizedTasks, searchTerm, filter]);

  const selectedDayTasks = useMemo(
    () => visibleTasks.filter((task) => task.dueDate === selectedDate),
    [selectedDate, visibleTasks]
  );

  const calendarDays = useMemo(() => {
    const monthStart = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const startOffset = (monthStart.getDay() + 6) % 7;
    const cells = [];

    for (let index = 0; index < 42; index += 1) {
      const day = new Date(monthStart);
      day.setDate(monthStart.getDate() - startOffset + index);
      const iso = day.toISOString().slice(0, 10);
      cells.push({
        day,
        iso,
        currentMonth: day.getMonth() === monthCursor.getMonth(),
        isToday: iso === todayISO,
        taskCount: (taskMap.get(iso) || []).length
      });
    }

    return cells;
  }, [monthCursor, taskMap]);

  const totalTasks = normalizedTasks.length;
  const completedCount = normalizedTasks.filter((task) => task.completed).length;
  const pendingCount = normalizedTasks.filter((task) => !task.completed).length;
  const dueTodayCount = normalizedTasks.filter((task) => task.dueDate === todayISO).length;

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;

    const payload = {
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: taskDate || todayISO,
      priority: taskPriority
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add task');

      const insertedTask = await response.json();
      setNewTaskTitle('');
      setTaskPriority('medium');
      setTaskDate(todayISO);
      setSelectedDate(insertedTask.dueDate || todayISO);
      setMonthCursor(new Date(`${insertedTask.dueDate || todayISO}T00:00:00`));
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to toggle task');
      const updatedTask = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <section className="board glass-panel">
        <header className="header-row">
          <div>
            <p className="eyebrow">Productivity dashboard</p>
            <h1>Student Task Manager</h1>
          </div>
          <span className="pill">Exp 6</span>
        </header>

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat-box success">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-box warning">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-box info">
            <span className="stat-value">{dueTodayCount}</span>
            <span className="stat-label">Due today</span>
          </div>
        </div>

        <form className="task-form" onSubmit={handleAddTask}>
          <div className="field-group wide">
            <label htmlFor="task-title">Task name</label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="task-date">Due date</label>
            <input
              id="task-date"
              type="date"
              value={taskDate}
              onChange={(event) => setTaskDate(event.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={taskPriority}
              onChange={(event) => setTaskPriority(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="primary-button">Add task</button>
        </form>

        <div className="toolbar">
          <div className="search-box">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Search tasks"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-row" aria-label="task filters">
            {['all', 'today', 'upcoming', 'done', 'pending'].map((option) => (
              <button
                key={option}
                type="button"
                className={filter === option ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setFilter(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Fetching tasks from the backend...</p>
          </div>
        ) : (
          <div className="task-list">
            {visibleTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <p>No tasks match this filter yet.</p>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? 'complete' : ''}`}>
                  <button type="button" className="task-toggle" onClick={() => handleToggleTask(task.id)}>
                    {task.completed ? '✓' : ''}
                  </button>

                  <div className="task-content-wrap">
                    <div className="task-summary-row">
                      <span className="task-title">{task.title}</span>
                      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                    </div>
                    <div className="task-meta-row">
                      <span>📅 {formatDateString(task.dueDate)}</span>
                      <span>{task.completed ? 'Completed' : 'In progress'}</span>
                    </div>
                  </div>

                  <button type="button" className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 0))} disabled={page === 0}>
              Previous
            </button>
            <span>
              Page {page + 1} / {totalPages}
            </span>
            <button type="button" onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))} disabled={page >= totalPages - 1}>
              Next
            </button>
          </div>
        )}
      </section>

      <aside className="calendar-panel glass-panel">
        <div className="calendar-header">
          <div>
            <p className="eyebrow">Calendar</p>
            <h2>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthCursor)}</h2>
          </div>
          <div className="calendar-nav">
            <button type="button" onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}>←</button>
            <button type="button" onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}>→</button>
          </div>
        </div>

        <div className="weekday-row">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((item) => (
            <button
              key={item.iso}
              type="button"
              className={[
                'calendar-day',
                item.currentMonth ? '' : 'muted',
                item.isToday ? 'today' : '',
                selectedDate === item.iso ? 'selected' : ''
              ].join(' ')}
              onClick={() => setSelectedDate(item.iso)}
            >
              <span className="day-number">{item.day.getDate()}</span>
              {item.taskCount > 0 && <span className="dot-badge">{item.taskCount}</span>}
            </button>
          ))}
        </div>

        <div className="selected-day-panel">
          <h3>{formatDateString(selectedDate)}</h3>
          {selectedDayTasks.length === 0 ? (
            <p className="panel-empty">No tasks planned for this date.</p>
          ) : (
            <ul>
              {selectedDayTasks.map((task) => (
                <li key={task.id} className={task.completed ? 'done' : ''}>
                  <span>{task.title}</span>
                  <small>{task.priority}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

export default App;
