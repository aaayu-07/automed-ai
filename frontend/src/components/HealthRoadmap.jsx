
const HealthRoadmap = ({ predictionData }) => {
    const { risk_level, probability, inputs } = predictionData;

    // Only show roadmap for Moderate or High risk
    if (risk_level === 'Low') return null;

    // Helper to generate weeks based on factors
    const generateRoadmap = () => {
        const weeks = [
            { title: "Week 1: Stabilization", tasks: ["Monitor daily vitals", "Hydration focus (3L/day)"] },
            { title: "Week 2: Dietary Shift", tasks: ["Reduce sugar intake by 50%", "Leafy greens at every meal"] },
            { title: "Week 3: Active Recovery", tasks: ["20min daily walk", "Sleep schedule deviation < 30min"] },
            { title: "Week 4: Maintenance", tasks: ["Follow-up screening", "Establish long-term routine"] }
        ];

        // Customization logic
        if (inputs.BMI > 30) {
            weeks[0].tasks.push("Caloric deficit start (-300kcal)");
            weeks[2].tasks.push("Low-impact cardio session");
        }
        if (inputs.Glucose > 140) {
            weeks[1].tasks.push("Replace white carbs with complex");
            weeks[3].tasks.push("HbA1c test check");
        }
        if (inputs.BloodPressure > 80) {
            weeks[0].tasks.push("Sodium reduction (<2g/day)");
            weeks[2].tasks.push("Stress management breathing");
        }

        return weeks;
    };

    const roadmap = generateRoadmap();

    return (
        <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', padding: '2rem' }}>
            <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: risk_level === 'High' ? 'var(--danger)' : 'var(--warning)'
            }}>
                <span style={{ fontSize: '1.8rem' }}>🛡️</span> Preventive Action Roadmap
            </h3>

            <div className="roadmap-container" style={{ position: 'relative', paddingLeft: '20px' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '29px',
                    top: '10px',
                    bottom: '50px',
                    width: '2px',
                    background: 'var(--border-color)'
                }}></div>

                {roadmap.map((week, index) => (
                    <div key={index} style={{
                        position: 'relative',
                        marginBottom: '2.5rem',
                        paddingLeft: '40px'
                    }}>
                        {/* Dot */}
                        <div style={{
                            position: 'absolute',
                            left: '0',
                            top: '5px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: index === 0 ? 'var(--primary)' : '#F8FAFC',
                            border: `2px solid ${index === 0 ? 'var(--primary)' : 'var(--border-color)'}`,
                            zIndex: 2,
                            boxShadow: index === 0 ? '0 0 10px rgba(14, 165, 233, 0.3)' : 'none'
                        }}></div>

                        <h4 style={{
                            fontSize: '1.1rem',
                            marginBottom: '0.8rem',
                            color: index === 0 ? 'var(--text-main)' : 'var(--text-muted)'
                        }}>
                            {week.title}
                        </h4>

                        <div style={{
                            background: '#F8FAFC',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                        }}>
                            {week.tasks.map((task, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> {task}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HealthRoadmap;
