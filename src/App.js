import React, { useState, useRef } from 'react';
import { Upload, Leaf, BarChart3, Lightbulb, Camera, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

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
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simulate API call - Replace with actual backend call
    setTimeout(() => {
      const mockResults = {
        total_emissions: 8.245,
        total_items: 12,
        matched_items: 10,
        unmatched_items: 2,
        confidence_stats: { high: 6, medium: 3, low: 1 },
        item_breakdown: [
          { original_name: 'Bananas', matched_product: 'bananas', quantity: 2.0, co2_per_kg: 0.7, total_co2: 1.4, similarity_score: 0.95 },
          { original_name: 'Chicken Breast', matched_product: 'poultry meat', quantity: 1.5, co2_per_kg: 6.9, total_co2: 10.35, similarity_score: 0.88 },
          { original_name: 'Milk', matched_product: 'milk', quantity: 1.0, co2_per_kg: 3.2, total_co2: 3.2, similarity_score: 1.0 },
          { original_name: 'Bread', matched_product: 'wheat & rye (bread)', quantity: 0.5, co2_per_kg: 1.4, total_co2: 0.7, similarity_score: 0.92 },
          { original_name: 'Apples', matched_product: 'apples', quantity: 1.2, co2_per_kg: 0.4, total_co2: 0.48, similarity_score: 1.0 },
          { original_name: 'Cheese', matched_product: 'cheese', quantity: 0.3, co2_per_kg: 13.5, total_co2: 4.05, similarity_score: 0.92 }
        ]
      };
      
      setAnalysisResults(mockResults);
      setIsLoading(false);
    }, 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getEcoRating = (avgEmissions) => {
    if (avgEmissions < 2) return { rating: 'A+', color: 'text-green-600' };
    if (avgEmissions < 4) return { rating: 'A', color: 'text-green-500' };
    if (avgEmissions < 6) return { rating: 'B', color: 'text-yellow-500' };
    if (avgEmissions < 8) return { rating: 'C', color: 'text-orange-500' };
    return { rating: 'D', color: 'text-red-500' };
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (score) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.5) return 'Medium';
    return 'Low';
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        active
          ? 'bg-white text-blue-600 shadow-md'
          : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:bg-opacity-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const SummaryCard = ({ title, value, subtitle, trend }) => (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-3xl font-light">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-red-200' : 'text-green-200'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-blue-100 text-sm font-medium">{title}</p>
      {subtitle && <p className="text-blue-200 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  const UploadZone = () => (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
      className="border-3 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50"
    >
      <Camera className="mx-auto text-blue-500 mb-4" size={48} />
      <h3 className="text-xl text-gray-700 mb-2">Upload your grocery bill</h3>
      <p className="text-gray-500 mb-4">Drag & drop or click to select an image</p>
      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
        Choose File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />
    </div>
  );

  const LoadingSpinner = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Analyzing your grocery bill...</p>
    </div>
  );

  const AnalysisTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <UploadZone />
        
        {uploadedImage && (
          <div className="mt-6 text-center">
            <img
              src={uploadedImage}
              alt="Uploaded bill"
              className="max-w-xs max-h-48 mx-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {isLoading && <LoadingSpinner />}
      </div>

      {analysisResults && !isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total CO2 Emissions"
              value={`${analysisResults.total_emissions.toFixed(2)} kg`}
              subtitle="CO2 equivalent"
            />
            <SummaryCard
              title="Items Analyzed"
              value={analysisResults.total_items}
              subtitle="Products scanned"
            />
            <SummaryCard
              title="Match Rate"
              value={`${Math.round((analysisResults.matched_items / analysisResults.total_items) * 100)}%`}
              subtitle="Successfully identified"
            />
            <SummaryCard
              title="Eco Rating"
              value={getEcoRating(analysisResults.total_emissions / analysisResults.total_items).rating}
              subtitle="Environmental score"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 font-semibold text-gray-700">
              Detailed Item Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="px-6 py-3">Original Item</th>
                    <th className="px-6 py-3">Matched Product</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">CO2/kg</th>
                    <th className="px-6 py-3">Total CO2</th>
                    <th className="px-6 py-3">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analysisResults.item_breakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.original_name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.matched_product}</td>
                      <td className="px-6 py-4 text-gray-600">{item.quantity} kg</td>
                      <td className="px-6 py-4 text-gray-600">{item.co2_per_kg.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.total_co2.toFixed(2)}</td>
                      <td className={`px-6 py-4 font-medium ${getConfidenceColor(item.similarity_score)}`}>
                        {getConfidenceText(item.similarity_score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const MonthlyTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Monthly CO2 Emissions Trend</h2>
        <div className="bg-gray-50 rounded-lg p-12 text-center text-gray-500">
          📊 Monthly emissions chart will appear here after uploading bills
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="This Month" value="12.4 kg" subtitle="CO2 equivalent" trend={-8} />
        <SummaryCard title="Last Month" value="13.5 kg" subtitle="CO2 equivalent" />
        <SummaryCard title="This Year" value="148.8 kg" subtitle="CO2 equivalent" />
        <SummaryCard title="Ranking" value="🥉 Top 30%" subtitle="Among users" />
      </div>
    </div>
  );

  const OffsetPlan = ({ title, price, features, recommended = false }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:scale-105 ${
      recommended ? 'border-green-500 relative' : 'border-gray-100'
    }`}>
      {recommended && (
        <div className="absolute -top-3 left-6 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Recommended
        </div>
      )}
      <div className="text-center mb-6">
        <div className="text-3xl font-light text-blue-600 mb-2">{price}<span className="text-lg text-gray-500">/month</span></div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
        Subscribe
      </button>
    </div>
  );

  const OffsetTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <h2 className="text-2xl font-semibold mb-4">🌿 Carbon Offset Subscriptions</h2>
        <p className="text-gray-600 mb-8">Neutralize your grocery carbon footprint with verified offset programs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OffsetPlan
            title="Basic Plan"
            price="$5"
            features={[
              "Offset up to 15 kg CO2eq/month",
              "Forest conservation projects",
              "Monthly impact reports",
              "Basic recommendations"
            ]}
          />
          <OffsetPlan
            title="Eco Plus"
            price="$12"
            recommended={true}
            features={[
              "Offset up to 35 kg CO2eq/month",
              "Renewable energy projects",
              "Weekly insights & tips",
              "Premium recommendations",
              "Carbon calculator for all purchases"
            ]}
          />
          <OffsetPlan
            title="Climate Hero"
            price="$25"
            features={[
              "Unlimited CO2 offsetting",
              "Direct air capture projects",
              "Personal sustainability coach",
              "Family plan included",
              "Priority customer support",
              "Impact certificate"
            ]}
          />
        </div>
      </div>
    </div>
  );

  const InsightCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
      <div className="text-2xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

  const InsightsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InsightCard
        icon="🥩"
        title="Reduce Meat Consumption"
        description="Your beef purchases contribute to 65% of your carbon footprint. Try replacing one meat meal per week with plant-based alternatives to reduce emissions by 8.2 kg CO2eq monthly."
      />
      <InsightCard
        icon="🥬"
        title="Choose Local Produce"
        description="Opt for seasonal, locally grown vegetables. This can reduce your produce-related emissions by up to 40% while supporting local farmers."
      />
      <InsightCard
        icon="🧀"
        title="Dairy Alternatives"
        description="Consider plant-based milk alternatives like oat or almond milk. They have 3x lower carbon footprint compared to dairy milk."
      />
      <InsightCard
        icon="📦"
        title="Bulk Buying Benefits"
        description="Buying in bulk reduces packaging waste and transportation emissions. Consider purchasing non-perishables in larger quantities."
      />
      <InsightCard
        icon="🗓️"
        title="Weekly Shopping Pattern"
        description="Your shopping frequency analysis shows room for consolidation. Reducing trips from 3 to 2 per week could save 0.8 kg CO2eq monthly."
      />
      <InsightCard
        icon="⭐"
        title="Eco-Friendly Brands"
        description="Look for products with sustainability certifications. We've identified 12 eco-friendly alternatives for your regular purchases."
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            🌱 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EcoTrack</span>
          </h1>
          <p className="text-xl text-gray-600">Track your grocery shopping carbon footprint</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-100 p-2 rounded-xl">
          <TabButton
            id="analysis"
            icon={BarChart3}
            label="Analysis"
            active={activeTab === 'analysis'}
            onClick={setActiveTab}
          />
          <TabButton
            id="monthly"
            icon={TrendingUp}
            label="Monthly Tracking"
            active={activeTab === 'monthly'}
            onClick={setActiveTab}
          />
          <TabButton
            id="offset"
            icon={Leaf}
            label="Carbon Offset"
            active={activeTab === 'offset'}
            onClick={setActiveTab}
          />
          <TabButton
            id="insights"
            icon={Lightbulb}
            label="Insights"
            active={activeTab === 'insights'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'monthly' && <MonthlyTab />}
        {activeTab === 'offset' && <OffsetTab />}
        {activeTab === 'insights' && <InsightsTab />}
      </div>
    </div>
  );
};

export default App;