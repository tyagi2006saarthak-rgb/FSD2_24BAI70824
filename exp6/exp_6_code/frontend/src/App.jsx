import { useEffect, useMemo, useState } from 'react';
import './Reference.css';

const priorityOrder = { high: 3, medium: 2, low: 1 };
const toISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const todayISO = toISODate(new Date());

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
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarCursor, setCalendarCursor] = useState(new Date(`${todayISO}T00:00:00`));
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const pageSize = 5;

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

  const visibleTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...normalizedTasks]
      .filter((task) => {
        const matchesSearch = !query || task.title.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        const matchesStatus = filter === 'done'
          ? task.completed
          : filter === 'pending'
            ? !task.completed
            : true;
        const matchesDate = !selectedDate || task.dueDate === selectedDate;
        return matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        if (sortOrder === 'oldest') return a.id - b.id;
        if (sortOrder === 'priority') {
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        return b.id - a.id;
      });
  }, [normalizedTasks, searchTerm, filter, sortOrder, selectedDate]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), 1);
    const startOffset = (firstDay.getDay() + 6) % 7;

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), index - startOffset + 1);
      const iso = toISODate(date);
      return {
        date,
        iso,
        isCurrentMonth: date.getMonth() === calendarCursor.getMonth(),
        isToday: iso === todayISO,
        taskCount: normalizedTasks.filter((task) => task.dueDate === iso).length
      };
    });
  }, [calendarCursor, normalizedTasks]);

  const totalTasks = normalizedTasks.length;
  const completedCount = normalizedTasks.filter((task) => task.completed).length;
  const pendingCount = normalizedTasks.filter((task) => !task.completed).length;
  const overdueCount = normalizedTasks.filter(
    (task) => !task.completed && task.dueDate < todayISO
  ).length;
  const progress = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

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

      await response.json();
      setNewTaskTitle('');
      setTaskPriority('medium');
      setTaskDate(todayISO);
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
    <div className={`app-shell${isDarkTheme ? ' dark-theme' : ''}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Daylight home"><span className="brand-mark">✦</span> daylight</a>
        <div className="topbar-actions">
          <span className="focus-note"><span className="status-dot" /> Your little corner of focus</span>
          <button type="button" className="theme-toggle" aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`} aria-pressed={isDarkTheme} onClick={() => setIsDarkTheme((current) => !current)}>
            <span aria-hidden="true">{isDarkTheme ? '☼' : '◐'}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Student task manager <span>·</span> Experiment 06</p>
            <h1 id="hero-title">Make room for<br /><em>what matters.</em></h1>
            <p className="hero-description">A calmer way to keep track of your study goals, one task at a time.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="sparkle sparkle-one">✦</span><span className="sun" />
            <span className="hill hill-back" /><span className="hill hill-front" />
            <span className="plant-stem" /><span className="leaf leaf-left" /><span className="leaf leaf-right" />
            <span className="sparkle sparkle-two">✧</span>
          </div>
        </section>

        <section className="overview" aria-labelledby="overview-title">
          <div className="section-heading overview-heading">
            <div><p className="eyebrow">Your overview</p><h2 id="overview-title">A little progress adds up</h2></div>
            <span className="page-cap">Showing this page · {totalTasks} tasks max</span>
          </div>
          <div className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span className="stat-icon lavender">✦</span><strong>{totalTasks}</strong></div><span className="stat-label">On your list</span></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon mint">✓</span><strong>{completedCount}</strong></div><span className="stat-label">Completed</span></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon butter">◷</span><strong>{pendingCount}</strong></div><span className="stat-label">Still to do</span></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon rose">↗</span><strong>{overdueCount}</strong></div><span className="stat-label">Past due</span></article>
          </div>
          <div className="progress-caption"><span>Page progress</span><strong>{progress}%</strong></div>
          <div className="progress-track" role="progressbar" aria-label="Task completion" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${progress}%` }} /></div>
        </section>

        <div className="workbench">
        <section className="calendar-panel" aria-labelledby="calendar-title">
          <div className="calendar-heading">
            <div><p className="eyebrow">Plan your week</p><h2 id="calendar-title">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(calendarCursor)}</h2></div>
            <div className="calendar-actions">
              {selectedDate && <button type="button" className="clear-date" onClick={() => setSelectedDate('')}>All dates</button>}
              <button type="button" className="calendar-nav" aria-label="Previous month" onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}>‹</button>
              <button type="button" className="calendar-nav" aria-label="Next month" onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}>›</button>
            </div>
          </div>
          <div className="calendar-weekdays" aria-hidden="true">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarDays.map((item) => (
              <button
                key={item.iso}
                type="button"
                className={`calendar-day${item.isCurrentMonth ? '' : ' outside-month'}${item.isToday ? ' today' : ''}${selectedDate === item.iso ? ' selected' : ''}`}
                aria-label={`${formatDateString(item.iso)}${item.taskCount ? `, ${item.taskCount} ${item.taskCount === 1 ? 'task' : 'tasks'}` : ''}`}
                aria-pressed={selectedDate === item.iso}
                onClick={() => { setSelectedDate(item.iso); setTaskDate(item.iso); }}
              >
                <span>{item.date.getDate()}</span>
                {item.taskCount > 0 && <i aria-hidden="true" />}
              </button>
            ))}
          </div>
          <p className="calendar-caption">{selectedDate ? `Showing tasks for ${formatDateString(selectedDate)}` : 'Choose a day to filter your tasks'}</p>
        </section>

        <section className="planner" aria-labelledby="planner-title">
          <div className="section-heading planner-heading">
            <div><p className="eyebrow">The plan</p><h2 id="planner-title">Your tasks</h2></div>
            <span className="page-cap">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} on this page</span>
          </div>

          <form className="task-form" onSubmit={handleAddTask}>
            <div className="field-group title-field"><label htmlFor="task-title">Task name</label><input id="task-title" type="text" placeholder="e.g. Review lecture notes" value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} /></div>
            <div className="field-group priority-field"><label htmlFor="task-priority">Priority</label><select id="task-priority" value={taskPriority} onChange={(event) => setTaskPriority(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <div className="field-group date-field"><label htmlFor="task-date">Due date</label><input id="task-date" type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} /></div>
            <button type="submit" className="primary-button"><span aria-hidden="true">+</span> Add task</button>
          </form>

          <div className="toolbar">
            <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" aria-label="Find a task" placeholder="Find a task..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></label>
            <div className="list-controls">
              <div className="filter-row" aria-label="Task status filter">
                {[['all', 'All'], ['pending', 'To do'], ['done', 'Completed']].map(([value, label]) => <button key={value} type="button" className={filter === value ? 'filter-chip active' : 'filter-chip'} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
              </div>
              <label className="sort-control"><span className="visually-hidden">Sort tasks</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priority">Priority</option></select></label>
            </div>
          </div>

          {loading ? <div className="loading-state"><span className="spinner" /><p>Gathering your tasks...</p></div> : (
            <div className="task-list">
              {visibleTasks.length === 0 ? <div className="empty-state"><p>No tasks here right now. Add one to get started.</p></div> : visibleTasks.map((task) => {
                const isOverdue = !task.completed && task.dueDate < todayISO;
                const dateLabel = isOverdue ? `Overdue · ${formatDateString(task.dueDate)}` : `Due ${formatDateString(task.dueDate)}`;
                return (
                  <article key={task.id} className={`task-card ${task.completed ? 'complete' : ''}`}>
                    <button type="button" className="task-toggle" aria-label={`${task.completed ? 'Mark' : 'Complete'} ${task.title}`} aria-pressed={task.completed} onClick={() => handleToggleTask(task.id)}>{task.completed ? '✓' : ''}</button>
                    <div className="task-content-wrap"><span className="task-title">{task.title}</span><span className="task-meta">Task #{task.id} <span>·</span> {dateLabel}</span></div>
                    <span className={`priority-badge ${task.priority}`}><i />{task.priority}</span>
                    <button type="button" className="delete-button" aria-label={`Delete ${task.title}`} onClick={() => handleDeleteTask(task.id)}><span className="trash-icon" aria-hidden="true" /></button>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && <div className="pagination"><button type="button" onClick={() => setPage((current) => Math.max(current - 1, 0))} disabled={page === 0}>Previous</button><span>Page {page + 1} of {totalPages}</span><button type="button" onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))} disabled={page >= totalPages - 1}>Next</button></div>}
        </section>
        </div>
      </main>
    </div>
  );
}

export default App;
