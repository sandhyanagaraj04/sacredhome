import { useState, useEffect } from 'react';
import { dailyPrompts } from '../data/bookContent';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getStorageKey(date) {
  return `sacred-home-checkin-${date}`;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Practice() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % dailyPrompts.length;
  });
  const [journalText, setJournalText] = useState('');
  const [checkins, setCheckins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sacred-home-checkins') || '{}');
    } catch { return {}; }
  });
  const [journalEntries, setJournalEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sacred-home-journal') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('sacred-home-checkins', JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem('sacred-home-journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const prompt = dailyPrompts[currentPromptIndex];
  const today = getTodayStr();
  const checkedInToday = !!checkins[today];

  const handleCheckIn = () => {
    setCheckins({ ...checkins, [today]: true });
  };

  const handleJournalSubmit = () => {
    if (!journalText.trim()) return;
    const entry = {
      date: today,
      text: journalText.trim(),
      prompt: prompt.prompt,
      category: prompt.category,
    };
    setJournalEntries([entry, ...journalEntries.slice(0, 29)]);
    setJournalText('');
    if (!checkedInToday) handleCheckIn();
  };

  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (checkins[key]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getWeekDays = () => {
    const result = [];
    const d = new Date();
    const dayOfWeek = d.getDay();
    d.setDate(d.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        label: dayNames[i],
        date: dateStr,
        isToday: dateStr === today,
        completed: !!checkins[dateStr],
      });
      d.setDate(d.getDate() + 1);
    }
    return result;
  };

  const nextPrompt = () => {
    setCurrentPromptIndex((currentPromptIndex + 1) % dailyPrompts.length);
  };

  const prevPrompt = () => {
    setCurrentPromptIndex((currentPromptIndex - 1 + dailyPrompts.length) % dailyPrompts.length);
  };

  const streak = getStreak();
  const weekDays = getWeekDays();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Daily Practice</h1>
        <p>Reflect, check in, and build the habit of sacred home-keeping.</p>
      </div>

      <div className="practice-container">
        {/* Streak tracker */}
        <div className="checkin-section">
          <h3>Your Practice Streak</h3>
          <div className="streak-display">
            <div className="streak-number">{streak}</div>
            <div className="streak-label">
              <strong>Day Streak</strong>
              {streak === 0 ? "Start your streak today!" : streak < 7 ? "Building momentum..." : "You're on fire! Keep going."}
            </div>
          </div>
          <div className="week-grid">
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={`day-dot ${day.completed ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}
              >
                {day.label}
              </div>
            ))}
          </div>
          {!checkedInToday && (
            <button className="btn btn-primary" onClick={handleCheckIn} style={{ marginTop: '0.5rem' }}>
              Check In Today
            </button>
          )}
          {checkedInToday && (
            <p style={{ color: 'var(--accent-green)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              ✓ You've checked in today!
            </p>
          )}
        </div>

        {/* Daily prompt */}
        <div className="daily-prompt-card">
          <div className="prompt-category">{prompt.category}</div>
          <div className="prompt-text">{prompt.prompt}</div>
          <div className="prompt-reflection">{prompt.reflection}</div>
          <div className="prompt-nav">
            <button className="btn btn-secondary" onClick={prevPrompt} style={{ padding: '0.5rem 1.2rem' }}>
              ← Previous
            </button>
            <button className="btn btn-secondary" onClick={nextPrompt} style={{ padding: '0.5rem 1.2rem' }}>
              Next →
            </button>
          </div>
        </div>

        {/* Journal */}
        <div className="checkin-section">
          <h3>Journal Your Reflection</h3>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write your reflection here..."
          />
          <button
            className="btn btn-primary"
            onClick={handleJournalSubmit}
            disabled={!journalText.trim()}
            style={{ opacity: journalText.trim() ? 1 : 0.5 }}
          >
            Save Reflection
          </button>

          {journalEntries.length > 0 && (
            <div className="journal-entries">
              <h4 style={{ color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                Past Reflections
              </h4>
              {journalEntries.slice(0, 5).map((entry, i) => (
                <div className="journal-entry" key={i}>
                  <div className="entry-date">{entry.date} — {entry.category}</div>
                  <div className="entry-text">{entry.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
