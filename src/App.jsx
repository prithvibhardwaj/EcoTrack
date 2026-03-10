import React, { useState, useRef } from 'react';
import {
  Upload, Leaf, BarChart3, Lightbulb, Camera,
  CheckCircle, AlertCircle, TrendingUp, TrendingDown,
  Zap, Shield, Award, ChevronRight, Activity
} from 'lucide-react';

/* ──────────────────────────────────────────
   Utility helpers
────────────────────────────────────────── */
const getEcoRating = (avgEmissions) => {
  if (avgEmissions < 2) return { rating: 'A+', color: '#1fd468', label: 'Excellent' };
  if (avgEmissions < 4) return { rating: 'A', color: '#13a84f', label: 'Great' };
  if (avgEmissions < 6) return { rating: 'B', color: '#fbbf24', label: 'Average' };
  if (avgEmissions < 8) return { rating: 'C', color: '#f97316', label: 'Poor' };
  return { rating: 'D', color: '#f87171', label: 'Critical' };
};

const getConfidenceBadge = (score) => {
  if (score >= 0.8) return { cls: 'badge badge-high', label: 'High' };
  if (score >= 0.5) return { cls: 'badge badge-medium', label: 'Medium' };
  return { cls: 'badge badge-low', label: 'Low' };
};

/* ──────────────────────────────────────────
   Sub-components
────────────────────────────────────────── */
const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`nav-tab ${active ? 'active' : ''}`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, subtitle, trend, accentColor = '#0d803c', icon: Icon }) => (
  <div className="stat-card animate-slide-up">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
          {title}
        </p>
        <div className="flex items-end gap-2 mt-2">
          <span style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1, fontFamily: "'Orbitron', sans-serif" }}>
            {value}
          </span>
        </div>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {Icon && (
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `rgba(${accentColor === '#3b82f6' ? '59,130,246' : '13,128,60'},0.15)`,
          border: `1px solid rgba(${accentColor === '#3b82f6' ? '59,130,246' : '13,128,60'},0.3)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color: accentColor }} />
        </div>
      )}
    </div>
    {trend !== undefined && (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        color: trend > 0 ? '#f87171' : '#1fd468', fontSize: '0.75rem', fontWeight: 600
      }}>
        {trend > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{Math.abs(trend)}% vs last month</span>
      </div>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 20 }}>
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <div className="loader-ring" style={{ position: 'absolute', inset: 0 }} />
      <Leaf size={24} style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', color: '#0d803c'
      }} />
    </div>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', letterSpacing: '0.1em' }}>
      SCANNING RECEIPT...
    </p>
    <div className="progress-bar" style={{ width: 200 }}>
      <div className="progress-fill" style={{ width: '65%' }} />
    </div>
  </div>
);

/* ──────────────────────────────────────────
   Upload Zone
────────────────────────────────────────── */
const UploadZone = ({ onUpload, fileInputRef }) => (
  <div
    className="upload-zone"
    onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && onUpload(e.dataTransfer.files[0]); }}
    onDragOver={(e) => e.preventDefault()}
    onClick={() => fileInputRef.current?.click()}
  >
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
        background: 'rgba(13,128,60,0.12)',
        border: '2px solid rgba(13,128,60,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} className="animate-float">
        <Camera size={36} style={{ color: '#0d803c' }} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: 8 }}>
        Scan Your Grocery Receipt
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginBottom: 24 }}>
        Drag & drop or click to upload — supports JPG, PNG, HEIC
      </p>
      <button className="btn-primary">
        <Upload size={16} />
        Choose File
      </button>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
      style={{ display: 'none' }}
    />
  </div>
);

/* ──────────────────────────────────────────
   Analysis Tab
────────────────────────────────────────── */
const AnalysisTab = ({ uploadedImage, analysisResults, isLoading, error, onUpload, fileInputRef }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
    {/* Upload panel */}
    <div className="glass-card" style={{ padding: 32 }}>
      <UploadZone onUpload={onUpload} fileInputRef={fileInputRef} />

      {uploadedImage && !isLoading && (
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={uploadedImage}
              alt="Uploaded bill"
              style={{
                maxWidth: 240, maxHeight: 180, borderRadius: 12,
                border: '1px solid rgba(13,128,60,0.4)',
                boxShadow: '0 0 20px rgba(13,128,60,0.2)'
              }}
            />
            <div style={{
              position: 'absolute', top: -8, right: -8, width: 28, height: 28,
              borderRadius: '50%', background: '#0d803c',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(13,128,60,0.6)'
            }}>
              <CheckCircle size={16} color="#fff" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 20, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontSize: '0.875rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
    </div>

    {/* Results */}
    {analysisResults && !isLoading && (
      <>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <StatCard
            title="Total CO₂ Emissions"
            value={`${analysisResults.total_emissions.toFixed(2)}`}
            subtitle="kg CO₂ equivalent"
            icon={Activity}
            accentColor="#0d803c"
          />
          <StatCard
            title="Items Analysed"
            value={analysisResults.total_items}
            subtitle="Products scanned"
            icon={BarChart3}
            accentColor="#0d803c"
          />
          <StatCard
            title="Match Rate"
            value={`${Math.round((analysisResults.matched_items / analysisResults.total_items) * 100)}%`}
            subtitle="Successfully identified"
            icon={CheckCircle}
            accentColor="#3b82f6"
          />
          <StatCard
            title="Eco Rating"
            value={getEcoRating(analysisResults.total_emissions / analysisResults.total_items).rating}
            subtitle={getEcoRating(analysisResults.total_emissions / analysisResults.total_items).label}
            icon={Leaf}
            accentColor="#0d803c"
          />
        </div>

        {/* Confidence breakdown mini-bar */}
        <div className="glass-card" style={{ padding: '20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Confidence Distribution
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="badge badge-high">High: {analysisResults.confidence_stats.high}</span>
              <span className="badge badge-medium">Mid: {analysisResults.confidence_stats.medium}</span>
              <span className="badge badge-low">Low: {analysisResults.confidence_stats.low}</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round((analysisResults.confidence_stats.high / analysisResults.total_items) * 100)}%` }} />
          </div>
        </div>

        {/* Item Breakdown Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '18px 28px',
            borderBottom: '1px solid rgba(13,128,60,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Item Breakdown</span>
            <span style={{
              fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em'
            }}>
              {analysisResults.matched_items}/{analysisResults.total_items} matched
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Matched</th>
                  <th>Qty (kg)</th>
                  <th>CO₂/kg</th>
                  <th>Total CO₂</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {analysisResults.item_breakdown.map((item, i) => {
                  const badge = getConfidenceBadge(item.similarity_score);
                  const barWidth = (item.total_co2 / analysisResults.total_emissions) * 100;
                  return (
                    <tr key={i}>
                      <td style={{ color: '#fff', fontWeight: 500 }}>{item.original_name}</td>
                      <td style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
                        {item.matched_product}
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.7)' }}>{item.quantity}</td>
                      <td style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {item.co2_per_kg.toFixed(2)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", minWidth: 40 }}>
                            {item.total_co2.toFixed(2)}
                          </span>
                          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, minWidth: 60 }}>
                            <div style={{
                              height: '100%', width: `${barWidth}%`, borderRadius: 2,
                              background: 'linear-gradient(90deg, #0d803c, #3b82f6)',
                              boxShadow: '0 0 6px rgba(13,128,60,0.5)'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td><span className={badge.cls}>{badge.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}
  </div>
);

/* ──────────────────────────────────────────
   Monthly Tab
────────────────────────────────────────── */
const MonthlyTab = () => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const values = [18.2, 15.6, 14.1, 16.3, 13.5, 12.4];
  const maxVal = Math.max(...values);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard title="This Month" value="12.4 kg" subtitle="CO₂ equivalent" trend={-8} icon={Activity} accentColor="#0d803c" />
        <StatCard title="Last Month" value="13.5 kg" subtitle="CO₂ equivalent" icon={TrendingDown} accentColor="#3b82f6" />
        <StatCard title="This Year" value="148.8 kg" subtitle="Total so far" icon={BarChart3} accentColor="#0d803c" />
        <StatCard title="Your Rank" value="Top 30%" subtitle="Among all users" icon={Award} accentColor="#3b82f6" />
      </div>

      {/* Bar Chart */}
      <div className="glass-card" style={{ padding: 32 }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <BarChart3 size={18} style={{ color: '#0d803c' }} />
          <span style={{ fontWeight: 600, color: '#fff' }}>Monthly CO₂ Trend</span>
          <span style={{
            marginLeft: 'auto', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>last 6 months</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, padding: '0 8px' }}>
          {values.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                {v}
              </span>
              <div style={{ width: '100%', position: 'relative' }}>
                <div style={{
                  width: '100%',
                  height: Math.round((v / maxVal) * 160),
                  borderRadius: '6px 6px 0 0',
                  background: i === values.length - 1
                    ? 'linear-gradient(180deg, #1fd468 0%, #0d803c 100%)'
                    : 'linear-gradient(180deg, rgba(13,128,60,0.5) 0%, rgba(13,128,60,0.2) 100%)',
                  border: i === values.length - 1
                    ? '1px solid rgba(31,212,104,0.5)'
                    : '1px solid rgba(13,128,60,0.2)',
                  boxShadow: i === values.length - 1 ? '0 0 15px rgba(31,212,104,0.35)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>{months[i]}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 20, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(13,128,60,0.08)', border: '1px solid rgba(13,128,60,0.15)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <TrendingDown size={16} style={{ color: '#1fd468' }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
            <strong style={{ color: '#1fd468' }}>↓ 8.1%</strong> reduction vs last month — great progress!
          </span>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────
   Offset Tab
────────────────────────────────────────── */
const plans = [
  {
    title: 'Seedling',
    price: '$5',
    desc: 'Start your journey',
    features: ['Offset up to 15 kg CO₂eq/month', 'Forest conservation projects', 'Monthly impact reports', 'Basic recommendations'],
    icon: Leaf,
  },
  {
    title: 'Eco Plus',
    price: '$12',
    desc: 'Most popular choice',
    recommended: true,
    features: ['Offset up to 35 kg CO₂eq/month', 'Renewable energy projects', 'Weekly insights & tips', 'Premium recommendations', 'Cross-purchase calculator'],
    icon: Zap,
  },
  {
    title: 'Climate Hero',
    price: '$25',
    desc: 'Maximum impact',
    features: ['Unlimited CO₂ offsetting', 'Direct air capture projects', 'Personal sustainability coach', 'Family plan included', 'Impact certificate'],
    icon: Shield,
  },
];

const OffsetTab = () => (
  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: 8, fontFamily: "'Orbitron', sans-serif" }}>
        Carbon <span className="gradient-text-green">Offset</span> Plans
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto', fontSize: '0.9rem' }}>
        Neutralise your grocery footprint with verified, science-backed offset programmes
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
      {plans.map((plan) => {
        const Icon = plan.icon;
        return (
          <div
            key={plan.title}
            className={`glass-card plan-card${plan.recommended ? ' recommended' : ''}`}
            style={{ padding: 28, position: 'relative', overflow: 'hidden' }}
          >
            {plan.recommended && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: 'linear-gradient(135deg, #0d803c, #13a84f)',
                padding: '4px 16px 4px 12px',
                borderRadius: '0 16px 0 12px',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em'
              }}>
                RECOMMENDED
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: plan.recommended ? 'rgba(13,128,60,0.2)' : 'rgba(255,255,255,0.06)',
                border: plan.recommended ? '1px solid rgba(13,128,60,0.4)' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
              }}>
                <Icon size={24} style={{ color: plan.recommended ? '#1fd468' : 'rgba(255,255,255,0.5)' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: '0.05em' }}>
                {plan.desc}
              </p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{plan.title}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{
                  fontSize: '2.25rem', fontWeight: 700, color: plan.recommended ? '#1fd468' : '#fff',
                  fontFamily: "'Orbitron', sans-serif"
                }}>{plan.price}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>/month</span>
              </div>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.85rem' }}>
                  <CheckCircle size={15} style={{ color: '#0d803c', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{f}</span>
                </li>
              ))}
            </ul>

            <button className={plan.recommended ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>
              {plan.recommended ? 'Get Started' : 'Subscribe'}
              <ChevronRight size={15} />
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

/* ──────────────────────────────────────────
   Insights Tab
────────────────────────────────────────── */
const insights = [
  {
    icon: '🥩', title: 'Reduce Meat Consumption', impact: 'High Impact',
    description: 'Your beef purchases contribute to 65% of your carbon footprint. Try replacing one meat meal per week with plant-based alternatives to reduce emissions by 8.2 kg CO₂eq monthly.'
  },
  {
    icon: '🥬', title: 'Choose Local Produce', impact: 'Medium Impact',
    description: 'Opt for seasonal, locally grown vegetables. This can reduce your produce-related emissions by up to 40% while supporting local farmers.'
  },
  {
    icon: '🧀', title: 'Dairy Alternatives', impact: 'Medium Impact',
    description: 'Consider plant-based milk alternatives like oat or almond milk. They have 3× lower carbon footprint compared to dairy milk.'
  },
  {
    icon: '📦', title: 'Bulk Buying Benefits', impact: 'Low Impact',
    description: 'Buying in bulk reduces packaging waste and transportation emissions. Consider purchasing non-perishables in larger quantities.'
  },
  {
    icon: '🗓️', title: 'Shopping Frequency', impact: 'Low Impact',
    description: 'Your shopping frequency analysis shows room for consolidation. Reducing trips from 3 to 2 per week could save 0.8 kg CO₂eq monthly.'
  },
  {
    icon: '⭐', title: 'Eco-Friendly Brands', impact: 'Medium Impact',
    description: 'Look for products with sustainability certifications. We've identified 12 eco - friendly alternatives for your regular purchases.' },
];

const impactColor = { 'High Impact': '#f87171', 'Medium Impact': '#fbbf24', 'Low Impact': '#1fd468' };

const InsightsTab = () => (
  <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
    {insights.map((item, i) => (
      <div key={i} className="glass-card insight-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(13,128,60,0.1)', border: '1px solid rgba(13,128,60,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
          }}>
            {item.icon}
          </div>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
            color: impactColor[item.impact],
            background: `${impactColor[item.impact]}18`,
            border: `1px solid ${impactColor[item.impact]}40`,
            padding: '3px 10px', borderRadius: 20
          }}>
            {item.impact.toUpperCase()}
          </span>
        </div>
        <h3 style={{ fontWeight: 600, color: '#fff', marginBottom: 10, fontSize: '0.95rem' }}>
          {item.title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', lineHeight: 1.7 }}>
          {item.description}
        </p>
        <button style={{
          marginTop: 16, display: 'flex', alignItems: 'center', gap: 4,
          color: '#0d803c', fontSize: '0.8rem', fontWeight: 600,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          transition: 'color 0.2s ease'
        }}
          onMouseOver={(e) => e.currentTarget.style.color = '#1fd468'}
          onMouseOut={(e) => e.currentTarget.style.color = '#0d803c'}
        >
          Learn more <ChevronRight size={14} />
        </button>
      </div>
    ))}
  </div>
);

/* ──────────────────────────────────────────
   Main App
────────────────────────────────────────── */
const App = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target.result);
    reader.readAsDataURL(file);

    setTimeout(() => {
      setAnalysisResults({
        total_emissions: 8.245,
        total_items: 12,
        matched_items: 10,
        unmatched_items: 2,
        confidence_stats: { high: 6, medium: 3, low: 1 },
        item_breakdown: [
          { original_name: 'Bananas', matched_product: 'bananas', quantity: 2.0, co2_per_kg: 0.70, total_co2: 1.40, similarity_score: 0.95 },
          { original_name: 'Chicken Breast', matched_product: 'poultry meat', quantity: 1.5, co2_per_kg: 6.90, total_co2: 10.35, similarity_score: 0.88 },
          { original_name: 'Milk', matched_product: 'milk', quantity: 1.0, co2_per_kg: 3.20, total_co2: 3.20, similarity_score: 1.00 },
          { original_name: 'Bread', matched_product: 'wheat & rye (bread)', quantity: 0.5, co2_per_kg: 1.40, total_co2: 0.70, similarity_score: 0.92 },
          { original_name: 'Apples', matched_product: 'apples', quantity: 1.2, co2_per_kg: 0.40, total_co2: 0.48, similarity_score: 1.00 },
          { original_name: 'Cheese', matched_product: 'cheese', quantity: 0.3, co2_per_kg: 13.5, total_co2: 4.05, similarity_score: 0.92 },
        ],
      });
      setIsLoading(false);
    }, 3000);
  };

  const tabs = [
    { id: 'analysis', icon: BarChart3, label: 'Analysis' },
    { id: 'monthly', icon: TrendingUp, label: 'Monthly Tracking' },
    { id: 'offset', icon: Leaf, label: 'Carbon Offset' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 60px' }}>
      {/* Ambient green orb bottom-left */}
      <div style={{
        position: 'fixed', bottom: -150, left: -150, width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(13,128,60,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      {/* Ambient blue orb top-right */}
      <div style={{
        position: 'fixed', top: -100, right: -100, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <header style={{ paddingTop: 52, paddingBottom: 44, textAlign: 'center' }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(13,128,60,0.25) 0%, rgba(59,130,246,0.15) 100%)',
              border: '1px solid rgba(13,128,60,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(13,128,60,0.25)',
            }} className="animate-glow">
              <Leaf size={36} style={{ color: '#1fd468' }} />
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700, letterSpacing: '0.05em', marginBottom: 12, lineHeight: 1.1
          }}>
            <span className="gradient-text-green">ECO</span>
            <span style={{ color: '#fff' }}>TRACK</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Intelligent Carbon Footprint Analysis
          </p>

          {/* Status bar */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 18, padding: '6px 16px', borderRadius: 20,
            background: 'rgba(13,128,60,0.1)', border: '1px solid rgba(13,128,60,0.25)',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#1fd468',
              boxShadow: '0 0 8px rgba(31,212,104,0.8)', animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* ── Navigation ── */}
        <nav style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6,
          marginBottom: 32,
          padding: '8px 12px',
          background: 'rgba(4,47,20,0.35)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(13,128,60,0.18)',
          borderRadius: 14,
        }}>
          {tabs.map((t) => (
            <TabButton
              key={t.id}
              id={t.id}
              icon={t.icon}
              label={t.label}
              active={activeTab === t.id}
              onClick={setActiveTab}
            />
          ))}
        </nav>

        {/* ── Content ── */}
        {activeTab === 'analysis' && (
          <AnalysisTab
            uploadedImage={uploadedImage}
            analysisResults={analysisResults}
            isLoading={isLoading}
            error={error}
            onUpload={handleFileUpload}
            fileInputRef={fileInputRef}
          />
        )}
        {activeTab === 'monthly' && <MonthlyTab />}
        {activeTab === 'offset' && <OffsetTab />}
        {activeTab === 'insights' && <InsightsTab />}

        {/* ── Footer ── */}
        <footer style={{
          marginTop: 64, paddingTop: 20,
          borderTop: '1px solid rgba(13,128,60,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
            © 2026 ECOTRACK — CARBON INTELLIGENCE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d803c' }} />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
              VERIFIED DATA SOURCES
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;