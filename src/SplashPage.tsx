import MarketChart from './MarketChart'

interface SplashPageProps {
  onEnter: () => void
}

function SplashPage({ onEnter }: SplashPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-6xl">📊</div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                Scioto Business Systems
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-200 font-light">
              Data-Driven Market Intelligence
            </p>
          </div>

          {/* Value Proposition */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              Empowering strategic decision-making through comprehensive market analysis,
              advanced analytics, and actionable business intelligence.
            </p>
          </div>

          {/* Live Market Chart */}
          <div className="max-w-3xl mx-auto mt-8">
            <MarketChart />
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-semibold text-white mb-2">Market Trends</h3>
              <p className="text-gray-300 text-sm">
                Real-time analysis of market dynamics and emerging patterns
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Strategic Insights</h3>
              <p className="text-gray-300 text-sm">
                Data-backed recommendations for informed business decisions
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Analytics Platform</h3>
              <p className="text-gray-300 text-sm">
                Comprehensive tools for market research and competitive analysis
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <div className="splash">
            <button
              onClick={onEnter}
             className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-yellow-200 bg-blue-400 rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl">
              <span className="relative z-10">Enter Application</span>
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
          </div>

          {/* Footer */}
          <div className="pt-12">
            <p className="text-sm text-gray-400">
              Professional Market Analysis Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default SplashPage
