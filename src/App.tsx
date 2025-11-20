import { useState, useEffect } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'

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
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Dashboard signOut={signOut} user={user} />
      )}
    </Authenticator>
  )
}

function Dashboard({ signOut, user }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const [sysBsItems, setSysBsItems] = useState<Schema['SBSys']['type'][]>([])
  const [newContent, setNewContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSysBsItems()
  }, [])

  async function fetchSysBsItems() {
    setLoading(true)
    try {
      const { data } = await client.models.SBSys.list()
      setSysBsItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createSysBsItem() {
    if (!newContent.trim()) return

    try {
      await client.models.SBSys.create({
        content: newContent
      })
      setNewContent('')
      fetchSysBsItems()
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  async function deleteSysBsItem(id: string) {
    try {
      await client.models.SBSys.delete({ id })
      fetchSysBsItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen && <h1 className="text-xl font-bold">SBSys</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveView('items')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeView === 'items'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">📋</span>
            {sidebarOpen && <span>Items</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeView === 'dashboard' ? 'Dashboard' : 'Business Items'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {sysBsItems.length}
                      </p>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active User</p>
                      <p className="text-xl font-bold text-gray-900">
                        {user?.username || 'User'}
                      </p>
                    </div>
                    <div className="text-4xl">👤</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-xl font-bold text-green-600">Active</p>
                    </div>
                    <div className="text-4xl">✅</div>
                  </div>
                </div>
              </div>

              {/* Recent Items */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Items
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : sysBsItems.length === 0 ? (
                    <p className="text-gray-500">
                      No items yet. Create your first item!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {sysBsItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-900">{item.content}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeView === 'items' && (
            <div className="space-y-6">
              {/* Create New Item */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Create New Item
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createSysBsItem()}
                    placeholder="Enter item content..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={createSysBsItem}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Items ({sysBsItems.length})
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : sysBsItems.length === 0 ? (
                    <p className="text-gray-500">
                      No items yet. Create your first item above!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {sysBsItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">
                              {item.content}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Created: {new Date(item.createdAt).toLocaleString()}
                              {item.updatedAt !== item.createdAt && (
                                <> • Updated: {new Date(item.updatedAt).toLocaleString()}</>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteSysBsItem(item.id)}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
