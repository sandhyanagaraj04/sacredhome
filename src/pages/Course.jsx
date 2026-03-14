import { useState, useEffect } from 'react';
import { courseModules } from '../data/bookContent';

export default function Course() {
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sacred-home-completed') || '[]');
    } catch { return []; }
  });
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sacred-home-notes') || '{}');
    } catch { return {}; }
  });
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    localStorage.setItem('sacred-home-completed', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('sacred-home-notes', JSON.stringify(notes));
  }, [notes]);

  const getModuleProgress = (mod) => {
    const total = mod.lessons.length;
    const done = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
    return Math.round((done / total) * 100);
  };

  const totalProgress = () => {
    const total = courseModules.reduce((sum, m) => sum + m.lessons.length, 0);
    return Math.round((completedLessons.length / total) * 100);
  };

  const markComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const saveNote = (lessonId) => {
    if (!noteText.trim()) return;
    setNotes({ ...notes, [lessonId]: noteText.trim() });
    setNoteText('');
  };

  // Module list view
  if (!activeModule) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Sacred Home Course</h1>
          <p>Six modules to transform your household. Complete at your own pace.</p>
          <div style={{ marginTop: '1rem' }}>
            <div className="progress-bar" style={{ maxWidth: '400px', margin: '0 auto', height: '8px' }}>
              <div className="progress-fill" style={{ width: `${totalProgress()}%` }} />
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{totalProgress()}% Complete</p>
          </div>
        </div>

        <div className="module-list">
          {courseModules.map((mod) => {
            const progress = getModuleProgress(mod);
            return (
              <div
                className="module-card"
                key={mod.id}
                onClick={() => setActiveModule(mod)}
              >
                <div className="module-number">Module {mod.id}</div>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <div className="module-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Lesson view
  if (activeLesson) {
    const mod = activeModule;
    const lessonIndex = mod.lessons.findIndex((l) => l.id === activeLesson.id);
    const isComplete = completedLessons.includes(activeLesson.id);
    const savedNote = notes[activeLesson.id];

    const goNext = () => {
      if (lessonIndex < mod.lessons.length - 1) {
        setActiveLesson(mod.lessons[lessonIndex + 1]);
        setNoteText('');
      } else {
        setActiveLesson(null);
      }
    };

    const goPrev = () => {
      if (lessonIndex > 0) {
        setActiveLesson(mod.lessons[lessonIndex - 1]);
        setNoteText('');
      }
    };

    return (
      <div className="page">
        <div className="page-header">
          <p style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => { setActiveLesson(null); }}>
            ← Back to {mod.title}
          </p>
          <h1 style={{ fontSize: '2rem' }}>{activeLesson.title}</h1>
          <p>Module {mod.id} — Lesson {lessonIndex + 1} of {mod.lessons.length}</p>
        </div>

        <div className="lesson-view">
          <div className="lesson-content fade-in">
            <div className="lesson-text">{activeLesson.content}</div>

            <div className="exercise-box">
              <h4>✍️ Exercise</h4>
              <p>{activeLesson.exercise}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="checkin-section">
            <h3>Your Notes</h3>
            {savedNote && (
              <div className="journal-entry" style={{ marginBottom: '1rem' }}>
                <div className="entry-text">{savedNote}</div>
              </div>
            )}
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your notes and exercise responses here..."
            />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => saveNote(activeLesson.id)}
                disabled={!noteText.trim()}
                style={{ opacity: noteText.trim() ? 1 : 0.5 }}
              >
                Save Notes
              </button>
              {!isComplete && (
                <button className="btn btn-primary" onClick={() => markComplete(activeLesson.id)}>
                  Mark as Complete ✓
                </button>
              )}
              {isComplete && (
                <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✓ Completed
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="lesson-nav">
            <button
              className="btn btn-secondary"
              onClick={goPrev}
              disabled={lessonIndex === 0}
              style={{ opacity: lessonIndex === 0 ? 0.5 : 1 }}
            >
              ← Previous Lesson
            </button>
            <button className="btn btn-primary" onClick={goNext}>
              {lessonIndex < mod.lessons.length - 1 ? 'Next Lesson →' : 'Back to Module'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Module detail view (lesson list)
  return (
    <div className="page">
      <div className="page-header">
        <p style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setActiveModule(null)}>
          ← Back to All Modules
        </p>
        <h1 style={{ fontSize: '2.2rem' }}>{activeModule.title}</h1>
        <p>{activeModule.description}</p>
      </div>

      <div className="module-list">
        {activeModule.lessons.map((lesson, i) => {
          const isComplete = completedLessons.includes(lesson.id);
          return (
            <div
              className="module-card"
              key={lesson.id}
              onClick={() => { setActiveLesson(lesson); setNoteText(''); }}
              style={{ borderLeftColor: isComplete ? 'var(--accent-green)' : 'transparent', borderLeftWidth: '3px', borderLeftStyle: 'solid' }}
            >
              <div className="module-number">
                {isComplete ? '✓ ' : ''}Lesson {i + 1}
              </div>
              <h3>{lesson.title}</h3>
              <p style={{ fontSize: '0.9rem' }}>{lesson.content.substring(0, 120)}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
