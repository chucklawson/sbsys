import { useState } from 'react'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'
import SplashPage from './SplashPage'

const client = generateClient<Schema>()

interface DashboardProps {
  signOut?: () => void
  user?: {
    username?: string
    signInDetails?: {
      loginId?: string
    }
  }
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashPage onEnter={() => setShowSplash(false)} />
  }

  const handleSignOut = (amplifySignOut?: () => void) => {
    amplifySignOut?.()
    setShowSplash(true)
  }

  return (
    <Authenticator.Provider>
      <AuthContent onCancel={() => setShowSplash(true)} onSignOut={handleSignOut} />
    </Authenticator.Provider>
  )
}

function AuthContent({ onCancel, onSignOut }: { onCancel: () => void; onSignOut: (signOut?: () => void) => void }) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])

  if (authStatus === 'authenticated') {
    return (
      <Authenticator>
        {({ signOut, user }) => (
          <Dashboard signOut={() => onSignOut(signOut)} user={user} />
        )}
      </Authenticator>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <Authenticator />
      <button
        onClick={onCancel}
        className="mt-4 px-6 py-2 text-gray-300 hover:text-white transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  )
}

function Dashboard({ signOut, user }: DashboardProps) {
  const [activeView, setActiveView] = useState('dashboard')
  const [showBusinessApps, setShowBusinessApps] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    accounting: false,
    production: false,
    message: ''
  })

  const handleSendEmail = async () => {
    try {
      const services = []
      if (contactForm.accounting) services.push('Accounting Solutions')
      if (contactForm.production) services.push('Production Management')

      // Call the AWS Lambda function via GraphQL mutation
      const result = await client.mutations.sendContactEmail({
        companyName: contactForm.companyName,
        contactName: contactForm.contactName,
        email: contactForm.email,
        phoneNumber: contactForm.phoneNumber,
        services: services,
        message: contactForm.message,
      }, {
        authMode: 'apiKey'
      })

      console.log('Email sent successfully:', result)
      alert('Thank you! Your information request has been sent.')

      // Reset form and close modal
      setContactForm({
        companyName: '',
        contactName: '',
        email: '',
        phoneNumber: '',
        accounting: false,
        production: false,
        message: ''
      })
      setShowContactForm(false)
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Sorry, there was an error sending your request. Please try again.')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Menubar */}
      <header className="bg-gray-600 text-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo/Brand */}
          <h1 className="text-xl font-bold">SBSys</h1>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>

            {/* Contact */}
            <button
              onClick={() => setActiveView('contact')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'contact'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span>📧</span>
              <span>Contact</span>
            </button>

            {/* Business Apps Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBusinessApps(!showBusinessApps)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'accounting' || activeView === 'production'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span>💼</span>
                <span>Business Apps</span>
                <span className="text-xs">{showBusinessApps ? '▲' : '▼'}</span>
              </button>
              {showBusinessApps && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded-lg shadow-lg py-2 min-w-48 z-10">
                  <button
                    onClick={() => { setActiveView('accounting'); setShowBusinessApps(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600 transition-colors text-left"
                  >
                    <span>💰</span>
                    <span>Accounting</span>
                  </button>
                  <button
                    onClick={() => { setActiveView('production'); setShowBusinessApps(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600 transition-colors text-left"
                  >
                    <span>🏭</span>
                    <span>Production Management</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {user?.signInDetails?.loginId}
            </span>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome, {user?.username || 'User'}!
                </h2>
                <p className="text-gray-600">
                  Access your business applications from the menu above.
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setActiveView('accounting')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">💰</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Accounting</h3>
                      <p className="text-gray-600">Financial management and reporting</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveView('production')}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🏭</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Production Management</h3>
                      <p className="text-gray-600">Manufacturing operations control</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Status Card */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">System Status</p>
                    <p className="text-xl font-bold text-green-600">All Systems Operational</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'accounting' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">💰</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Accounting</h2>
                    <p className="text-gray-600">Comprehensive Financial Management Solutions</p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    Our accounting module provides a complete suite of financial management tools designed
                    to streamline your business operations and ensure accurate financial reporting.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-xl font-semibold text-blue-900 mb-3">General Ledger</h3>
                      <p className="text-gray-700">
                        Maintain a complete record of all financial transactions with our double-entry
                        bookkeeping system. Track assets, liabilities, equity, revenue, and expenses
                        with ease.
                      </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-xl font-semibold text-green-900 mb-3">Accounts Payable</h3>
                      <p className="text-gray-700">
                        Manage vendor invoices, track payment due dates, and optimize cash flow.
                        Automated payment scheduling and approval workflows keep your payables organized.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="text-xl font-semibold text-purple-900 mb-3">Accounts Receivable</h3>
                      <p className="text-gray-700">
                        Track customer invoices, manage collections, and monitor aging reports.
                        Automated reminders and credit management tools improve cash collection.
                      </p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                      <h3 className="text-xl font-semibold text-orange-900 mb-3">Financial Reporting</h3>
                      <p className="text-gray-700">
                        Generate balance sheets, income statements, cash flow statements, and custom
                        reports. Real-time dashboards provide instant visibility into financial health.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Multi-currency support for international transactions</li>
                      <li>Bank reconciliation with automatic matching</li>
                      <li>Tax calculation and compliance reporting</li>
                      <li>Budget planning and variance analysis</li>
                      <li>Audit trail for all financial transactions</li>
                      <li>Integration with payroll and inventory systems</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'production' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">🏭</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Production Management</h2>
                    <p className="text-gray-600">End-to-End Manufacturing Operations Control</p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    Our production management system enables you to plan, execute, and monitor
                    manufacturing operations with precision. Optimize resources, reduce waste,
                    and improve delivery performance.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-3">Production Planning</h3>
                      <p className="text-gray-700">
                        Create and manage production schedules based on demand forecasts, inventory
                        levels, and capacity constraints. MRP and MPS tools ensure optimal planning.
                      </p>
                    </div>

                    <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                      <h3 className="text-xl font-semibold text-teal-900 mb-3">Shop Floor Control</h3>
                      <p className="text-gray-700">
                        Real-time tracking of work orders, labor, and machine utilization.
                        Monitor production progress and identify bottlenecks instantly.
                      </p>
                    </div>

                    <div className="bg-rose-50 p-6 rounded-lg border border-rose-200">
                      <h3 className="text-xl font-semibold text-rose-900 mb-3">Quality Management</h3>
                      <p className="text-gray-700">
                        Implement quality control checkpoints, manage inspections, and track
                        defects. Statistical process control ensures consistent product quality.
                      </p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                      <h3 className="text-xl font-semibold text-amber-900 mb-3">Inventory Control</h3>
                      <p className="text-gray-700">
                        Track raw materials, work-in-progress, and finished goods. Automated
                        reorder points and lot tracking ensure materials are always available.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Bill of Materials (BOM) management with version control</li>
                      <li>Work order creation and tracking</li>
                      <li>Machine maintenance scheduling</li>
                      <li>Labor time tracking and costing</li>
                      <li>Production analytics and KPI dashboards</li>
                      <li>Integration with supply chain and sales systems</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'contact' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">📧</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
                    <p className="text-gray-600">Request information about our solutions</p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    Interested in learning more about how Scioto Business Systems can help
                    transform your business operations? We'd love to hear from you!
                  </p>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Get In Touch</h3>
                    <p className="text-gray-700 mb-4">
                      Click the button below to fill out an information request form.
                      We'll receive your request via email at sciotobussys@gmail.com
                    </p>

                    <button
                      onClick={() => setShowContactForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <span>📧</span>
                      <span>Request Information</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Expect</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Response within 1-2 business days</li>
                      <li>Personalized consultation about your business needs</li>
                      <li>Detailed information on relevant solutions</li>
                      <li>Pricing and implementation options</li>
                      <li>No obligation - just helpful information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
      </main>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={contactForm.companyName}
                  onChange={(e) => setContactForm({...contactForm, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactForm.contactName}
                  onChange={(e) => setContactForm({...contactForm, contactName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactForm.phoneNumber}
                  onChange={(e) => setContactForm({...contactForm, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services of Interest
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contactForm.accounting}
                      onChange={(e) => setContactForm({...contactForm, accounting: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Accounting Solutions</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contactForm.production}
                      onChange={(e) => setContactForm({...contactForm, production: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Production Management</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={3}
                  placeholder="Any additional questions or comments..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowContactForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
