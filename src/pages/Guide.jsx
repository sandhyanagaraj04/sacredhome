import { useState } from 'react';
import { polarityQuestions, archetypes } from '../data/bookContent';

const steps = [
  { id: 'polarity', label: 'Polarity Assessment' },
  { id: 'roles', label: 'Archetypal Roles' },
  { id: 'rhythms', label: 'Rhythm Builder' },
  { id: 'constitution', label: 'Constitution' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning Ritual', 'Afternoon Anchor', 'Evening Ritual', 'Weekly Special'];

export default function Guide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [selectedArchetypes, setSelectedArchetypes] = useState([]);
  const [rhythms, setRhythms] = useState({});
  const [rhythmInput, setRhythmInput] = useState('');
  const [editingSlot, setEditingSlot] = useState(null);
  const [values, setValues] = useState([]);
  const [valueInput, setValueInput] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [showConstitution, setShowConstitution] = useState(false);

  const handleQuizAnswer = (qIndex, answer) => {
    setQuizAnswers({ ...quizAnswers, [qIndex]: answer });
  };

  const toggleArchetype = (name) => {
    setSelectedArchetypes((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : prev.length < 3 ? [...prev, name] : prev
    );
  };

  const addRhythm = (day, slot) => {
    if (!rhythmInput.trim()) return;
    const key = `${day}-${slot}`;
    setRhythms({ ...rhythms, [key]: rhythmInput.trim() });
    setRhythmInput('');
    setEditingSlot(null);
  };

  const addValue = () => {
    if (!valueInput.trim() || values.length >= 7) return;
    setValues([...values, valueInput.trim()]);
    setValueInput('');
  };

  const removeValue = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const getPolarityScore = () => {
    const answers = Object.values(quizAnswers);
    if (answers.length === 0) return 50;
    let score = 0;
    answers.forEach((a) => {
      if (a === 'a') score += 2;
      else if (a === 'b') score += 0;
      else score += 1;
    });
    return Math.round((score / (answers.length * 2)) * 100);
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'polarity':
        return (
          <div className="guide-card fade-in">
            <h2>Polarity Assessment</h2>
            <p className="description">
              Discover the dynamic between masculine and feminine energies in your home.
              Answer honestly — there are no right or wrong answers.
            </p>
            {polarityQuestions.map((q, i) => (
              <div className="quiz-question" key={i}>
                <p>{i + 1}. {q.question}</p>
                <div className="quiz-options">
                  {['a', 'b', 'c'].map((opt) => (
                    <button
                      key={opt}
                      className={`quiz-option ${quizAnswers[i] === opt ? 'selected' : ''}`}
                      onClick={() => handleQuizAnswer(i, opt)}
                    >
                      {q[`option${opt.toUpperCase()}`]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(quizAnswers).length >= 3 && (
              <div className="polarity-result">
                <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Your Polarity Profile</h3>
                <div className="polarity-meter">
                  <div className="polarity-marker" style={{ left: `${getPolarityScore()}%` }} />
                </div>
                <div className="polarity-labels">
                  <span>Receptive / Feminine</span>
                  <span>Balanced</span>
                  <span>Directive / Masculine</span>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                  {getPolarityScore() > 65
                    ? "You tend toward directive, structured energy. Your home benefits when you pair with someone who brings flow and warmth."
                    : getPolarityScore() < 35
                    ? "You tend toward receptive, nurturing energy. Your home benefits when you pair with someone who brings direction and structure."
                    : "You're fairly balanced. Consider where you could lean more into one energy to create greater polarity and magnetism."}
                </p>
              </div>
            )}
            <div className="guide-nav">
              <div />
              <button className="btn btn-primary" onClick={nextStep}>
                Next: Archetypal Roles →
              </button>
            </div>
          </div>
        );

      case 'roles':
        return (
          <div className="guide-card fade-in">
            <h2>Discover Your Archetypal Roles</h2>
            <p className="description">
              Select up to 3 archetypes that resonate with you. These represent the energies you naturally bring to your home.
            </p>
            <div className="archetype-grid">
              {archetypes.map((a) => (
                <div
                  key={a.name}
                  className={`archetype-card ${selectedArchetypes.includes(a.name) ? 'selected' : ''}`}
                  onClick={() => toggleArchetype(a.name)}
                >
                  <h4>{a.name}</h4>
                  <p>{a.description}</p>
                  <div className="archetype-traits">
                    {a.traits.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                    Domain: {a.domain}
                  </p>
                </div>
              ))}
            </div>
            {selectedArchetypes.length > 0 && (
              <div style={{ padding: '1rem', background: 'rgba(201,168,76,0.08)', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--gold)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Your Archetypes: {selectedArchetypes.join(', ')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  These are the energies you bring to your home. Own them fully. Let others in your household complement you.
                </p>
              </div>
            )}
            <div className="guide-nav">
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Next: Rhythm Builder →</button>
            </div>
          </div>
        );

      case 'rhythms':
        return (
          <div className="guide-card fade-in">
            <h2>Build Your Household Rhythms</h2>
            <p className="description">
              A home without rhythm is just a building. Design the daily and weekly anchors that give your home a heartbeat.
            </p>
            {days.map((day) => (
              <div className="rhythm-day" key={day}>
                <h4>{day}</h4>
                <div className="rhythm-slots">
                  {timeSlots.map((slot) => {
                    const key = `${day}-${slot}`;
                    const value = rhythms[key];
                    const isEditing = editingSlot === key;
                    return isEditing ? (
                      <div key={slot} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={rhythmInput}
                          onChange={(e) => setRhythmInput(e.target.value)}
                          placeholder={`${slot}...`}
                          onKeyDown={(e) => e.key === 'Enter' && addRhythm(day, slot)}
                          style={{ width: '200px' }}
                          autoFocus
                        />
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          onClick={() => addRhythm(day, slot)}
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        key={slot}
                        className={`rhythm-slot ${value ? 'filled' : ''}`}
                        onClick={() => { setEditingSlot(key); setRhythmInput(value || ''); }}
                      >
                        {value || slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="guide-nav">
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Next: Constitution →</button>
            </div>
          </div>
        );

      case 'constitution':
        return (
          <div className="guide-card fade-in">
            <h2>Your Household Constitution</h2>
            <p className="description">
              Nations have constitutions. Companies have mission statements. Now it's your home's turn.
              Write specific, actionable values that your household will live by.
            </p>

            {!showConstitution ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ color: 'var(--gold)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                    Family / Household Name
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="e.g., The Nagaraj Family"
                  />
                </div>

                <label style={{ color: 'var(--gold)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                  Add Your Values (up to 7)
                </label>
                <div className="value-input-row">
                  <input
                    type="text"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    placeholder="e.g., We speak directly, even when it's hard"
                    onKeyDown={(e) => e.key === 'Enter' && addValue()}
                  />
                  <button onClick={addValue}>Add</button>
                </div>

                {values.length > 0 && (
                  <ul className="value-list">
                    {values.map((v, i) => (
                      <li key={i}>
                        <span className="value-number">{i + 1}</span>
                        {v}
                        <button onClick={() => removeValue(i)}>×</button>
                      </li>
                    ))}
                  </ul>
                )}

                {values.length >= 3 && (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setShowConstitution(true)}
                  >
                    Generate Constitution
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="constitution-display">
                  <h3>Household Constitution</h3>
                  <p className="family-name">{familyName || 'Our Family'}</p>
                  <ol>
                    {values.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ol>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    "A constitution on a shelf is decoration. A constitution in daily life is transformation."
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setShowConstitution(false)}
                >
                  Edit Values
                </button>
              </>
            )}

            <div className="guide-nav" style={{ marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <div />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Interactive Guide</h1>
        <p>Walk through the Sacred Home framework step by step. Design your home intentionally.</p>
      </div>

      <div className="guide-steps">
        {steps.map((step, i) => (
          <button
            key={step.id}
            className={`guide-step-btn ${i === currentStep ? 'active' : ''} ${completedSteps.includes(i) ? 'completed' : ''}`}
            onClick={() => setCurrentStep(i)}
          >
            {completedSteps.includes(i) ? '✓ ' : ''}{step.label}
          </button>
        ))}
      </div>

      <div className="guide-content">
        {renderStep()}
      </div>
    </div>
  );
}
