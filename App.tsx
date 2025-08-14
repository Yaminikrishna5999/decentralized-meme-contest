import React, { useState, useEffect } from 'react';
import { Home, Trophy, Plus, Vote, ArrowLeft, Wallet, Award, Users, Clock, Trash2, Film, Heart, Laugh, Star, Gamepad2 } from 'lucide-react';

const MemeContestApp = () => {
  const [currentPage, setCurrentPage] = useState('wallet-connect');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Contest categories with icons and initial prize pools
  const contestCategories = {
    movies: { name: 'Movies', icon: Film, color: 'red', initialPrize: 100, fee: 3 },
    anime: { name: 'Anime', icon: Star, color: 'pink', initialPrize: 120, fee: 2.5 },
    comedy: { name: 'Comedy', icon: Laugh, color: 'yellow', initialPrize: 80, fee: 2 },
    love: { name: 'Love & Romance', icon: Heart, color: 'rose', initialPrize: 90, fee: 2.5 },
    fans: { name: 'Fan Favorites', icon: Users, color: 'indigo', initialPrize: 110, fee: 3 },
    gaming: { name: 'Gaming', icon: Gamepad2, color: 'green', initialPrize: 130, fee: 3.5 }
  };

  const [contests, setContests] = useState([
    // Movies Contest
    {
      id: 1,
      category: 'movies',
      owner: '0x123...abc',
      prizePool: 115,
      submissionFee: 3,
      submissions: [
        {
          id: 0,
          address: '0x456...def',
          imageUrl: 'https://res.cloudinary.com/dtf1nbthx/image/upload/v1755143558/Shrivel_Meme_h5cwtg.jpg',
          votes: 12,
          timestamp: Date.now() - 86400000
        },
        {
          id: 1,
          address: '0x789...ghi',
          imageUrl: 'https://i.imgflip.com/4t0m5h.jpg',
          votes: 8,
          timestamp: Date.now() - 72000000
        }
      ],
      status: 'active',
      endTime: Date.now() + 604800000
    },
    // Anime Contest
    {
      id: 2,
      category: 'anime',
      owner: '0x234...bcd',
      prizePool: 127.5,
      submissionFee: 2.5,
      submissions: [
        {
          id: 0,
          address: '0xabc...jkl',
          imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
          votes: 15,
          timestamp: Date.now() - 43200000
        },
        {
          id: 1,
          address: '0xdef...mno',
          imageUrl: 'https://i.imgflip.com/1bij.jpg',
          votes: 9,
          timestamp: Date.now() - 28800000
        }
      ],
      status: 'active',
      endTime: Date.now() + 518400000
    },
    // Comedy Contest
    {
      id: 3,
      category: 'comedy',
      owner: '0x345...cde',
      prizePool: 88,
      submissionFee: 2,
      submissions: [
        {
          id: 0,
          address: '0x567...pqr',
          imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
          votes: 20,
          timestamp: Date.now() - 21600000
        }
      ],
      status: 'active',
      endTime: Date.now() + 432000000
    },
    // Love Contest
    {
      id: 4,
      category: 'love',
      owner: '0x456...def',
      prizePool: 95,
      submissionFee: 2.5,
      submissions: [
        {
          id: 0,
          address: '0x678...stu',
          imageUrl: 'https://i.imgflip.com/3i7ksq.jpg',
          votes: 7,
          timestamp: Date.now() - 14400000
        },
        {
          id: 1,
          address: '0x789...vwx',
          imageUrl: 'https://i.imgflip.com/2fm6x.jpg',
          votes: 11,
          timestamp: Date.now() - 7200000
        }
      ],
      status: 'active',
      endTime: Date.now() + 345600000
    },
    // Fan Favorites Contest
    {
      id: 5,
      category: 'fans',
      owner: '0x567...efg',
      prizePool: 119,
      submissionFee: 3,
      submissions: [
        {
          id: 0,
          address: '0x890...yza',
          imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
          votes: 13,
          timestamp: Date.now() - 3600000
        }
      ],
      status: 'active',
      endTime: Date.now() + 259200000
    },
    // Gaming Contest
    {
      id: 6,
      category: 'gaming',
      owner: '0x678...fgh',
      prizePool: 137,
      submissionFee: 3.5,
      submissions: [
        {
          id: 0,
          address: '0x901...bcd',
          imageUrl: 'https://i.imgflip.com/1c1uej.jpg',
          votes: 6,
          timestamp: Date.now() - 1800000
        },
        {
          id: 1,
          address: '0x012...efg',
          imageUrl: 'https://i.imgflip.com/4acd7j.jpg',
          votes: 14,
          timestamp: Date.now() - 900000
        }
      ],
      status: 'active',
      endTime: Date.now() + 172800000
    }
  ]);
  
  const [selectedContest, setSelectedContest] = useState(null);
  const [userMemes, setUserMemes] = useState([]);

  // Connect to Petra Wallet
  const connectWallet = async () => {
    try {
      if ('aptos' in window) {
        const response = await window.aptos.connect();
        setWalletConnected(true);
        setWalletAddress(response.address);
        setCurrentPage('home');
      } else {
        alert('Petra Wallet not found. Please install Petra Wallet extension.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet. Please try again.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await window.aptos.disconnect();
      setWalletConnected(false);
      setWalletAddress('');
      setCurrentPage('wallet-connect');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Delete meme function
  const deleteMeme = (memeId) => {
    if (window.confirm('Are you sure you want to delete this meme? This action cannot be undone.')) {
      setUserMemes(userMemes.filter(meme => meme.id !== memeId));
      alert('Meme deleted successfully!');
    }
  };

  // Wallet Connection Page
  const WalletConnectPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <Trophy className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Meme Contest Hub</h1>
          <p className="text-gray-600">Connect your wallet to join themed contests!</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-700">6 themed contest categories</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Vote className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700">Submit memes & vote to win</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Award className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Win up to 130 APT prizes</span>
          </div>
        </div>
        
        <button 
          onClick={connectWallet}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Connect Petra Wallet</span>
        </button>
      </div>
    </div>
  );

  // Navigation Component
  const Navbar = () => (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6" />
          <h1 className="text-xl font-bold">Meme Contest Hub</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {walletConnected && (
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2">
                <span className="text-sm font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <button 
                onClick={disconnectWallet}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  // Back Button Component
  const BackButton = ({ to = 'home' }) => (
    <button 
      onClick={() => setCurrentPage(to)}
      className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to Home</span>
    </button>
  );

  // Home Page
  const HomePage = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to Meme Contest Hub!
        </h2>
        <p className="text-gray-600 text-lg">Choose your category, create memes, and compete for APT prizes</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <Plus className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Create Meme</h3>
          <p className="text-gray-600 mb-4">Create and save your own memes</p>
          <button 
            onClick={() => setCurrentPage('create-meme')}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Create Meme
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <Vote className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Browse Contests</h3>
          <p className="text-gray-600 mb-4">Explore themed contests and submit memes</p>
          <button 
            onClick={() => setCurrentPage('view-contests')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            View Contests
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
          <p className="text-gray-600 mb-4">See top performers and winners</p>
          <button 
            onClick={() => setCurrentPage('leaderboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            View Rankings
          </button>
        </div>
      </div>

      {/* Contest Categories Overview */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Contest Categories</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(contestCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            const activeContest = contests.find(c => c.category === key);
            return (
              <div key={key} className={`bg-gradient-to-r from-${category.color}-50 to-${category.color}-100 rounded-xl p-6 text-center hover:shadow-lg transition-all`}>
                <IconComponent className={`w-10 h-10 text-${category.color}-600 mx-auto mb-3`} />
                <h4 className="font-bold text-lg mb-2">{category.name}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Initial Prize: {category.initialPrize} APT</p>
                  <p>Entry Fee: {category.fee} APT</p>
                  {activeContest && (
                    <p className="font-semibold text-green-600">
                      Current Pool: {activeContest.prizePool} APT
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Platform Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{contests.length}</p>
            <p className="text-sm text-gray-600">Active Contests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {contests.reduce((sum, contest) => sum + contest.submissions.length, 0) + userMemes.length}
            </p>
            <p className="text-sm text-gray-600">Total Memes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {contests.reduce((sum, contest) => sum + contest.prizePool, 0)} APT
            </p>
            <p className="text-sm text-gray-600">Total Prizes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {contests.reduce((sum, contest) => 
                sum + contest.submissions.reduce((voteSum, submission) => voteSum + submission.votes, 0), 0
              )}
            </p>
            <p className="text-sm text-gray-600">Total Votes</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Create Meme Page
  const CreateMemePage = () => {
    const [memeTitle, setMemeTitle] = useState('');
    const [memeUrl, setMemeUrl] = useState('');
    const [memeDescription, setMemeDescription] = useState('');
    const [memeCategory, setMemeCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const createMeme = async () => {
      if (!memeTitle || !memeUrl || !memeCategory) {
        alert('Please fill in title, image URL, and select a category');
        return;
      }
      
      setLoading(true);
      
      // Simulate creating meme
      setTimeout(() => {
        const newMeme = {
          id: Date.now(), // Use timestamp as unique ID
          title: memeTitle,
          imageUrl: memeUrl,
          description: memeDescription,
          category: memeCategory,
          creator: walletAddress,
          createdAt: Date.now(),
          votes: 0
        };
        
        setUserMemes([...userMemes, newMeme]);
        setLoading(false);
        alert('Meme created successfully!');
        setMemeTitle('');
        setMemeUrl('');
        setMemeDescription('');
        setMemeCategory('');
        setCurrentPage('home');
      }, 1500);
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <BackButton />
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Create New Meme
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Meme Title</label>
              <input 
                type="text" 
                value={memeTitle}
                onChange={(e) => setMemeTitle(e.target.value)}
                className="w-full p-4 border-2 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter a catchy title for your meme"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={memeCategory}
                onChange={(e) => setMemeCategory(e.target.value)}
                className="w-full p-4 border-2 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">Select a category...</option>
                {Object.entries(contestCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input 
                type="url" 
                value={memeUrl}
                onChange={(e) => setMemeUrl(e.target.value)}
                className="w-full p-4 border-2 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter meme image URL (e.g., https://i.imgflip.com/...)"
              />
              
              {memeUrl && (
                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img 
                    src={memeUrl} 
                    alt="Meme preview" 
                    className="w-full max-w-xs rounded-lg mx-auto"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea 
                value={memeDescription}
                onChange={(e) => setMemeDescription(e.target.value)}
                className="w-full p-4 border-2 rounded-lg focus:border-green-500 focus:outline-none transition-colors h-24 resize-none"
                placeholder="Add a funny description or context for your meme"
              />
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Tips for great memes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Choose the right category for better targeting</li>
                <li>• Use popular meme templates for engagement</li>
                <li>• Keep text short and punchy</li>
                <li>• Make sure the image URL works properly</li>
                <li>• Be creative and original!</li>
              </ul>
            </div>
            
            <button 
              onClick={createMeme}
              disabled={!memeTitle || !memeUrl || !memeCategory || loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Meme...</span>
                </div>
              ) : (
                'Create Meme'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // View Contests Page
  const ViewContestsPage = () => (
    <div className="max-w-6xl mx-auto p-6">
      <BackButton />
      
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Contests & Your Memes
      </h2>
      
      {/* User's Created Memes Section */}
      {userMemes.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-green-600">Your Created Memes</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {userMemes.map((meme) => {
              const categoryInfo = contestCategories[meme.category];
              const IconComponent = categoryInfo?.icon || Star;
              return (
                <div key={meme.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={meme.imageUrl} 
                      alt={meme.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x200?text=Meme+${meme.id}`;
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Your Meme
                    </div>
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full p-2">
                      <IconComponent className={`w-4 h-4 text-${categoryInfo?.color || 'gray'}-600`} />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 line-clamp-2">{meme.title}</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full bg-${categoryInfo?.color || 'gray'}-100 text-${categoryInfo?.color || 'gray'}-800 font-medium`}>
                        {categoryInfo?.name || 'General'}
                      </span>
                    </div>
                    {meme.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{meme.description}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>Created {new Date(meme.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="flex-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium text-center">
                        Ready to submit
                      </span>
                      <button
                        onClick={() => deleteMeme(meme.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                        title="Delete meme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Active Contests Section */}
      <h3 className="text-2xl font-bold mb-6 text-purple-600">Active Contests by Category</h3>
      <div className="grid gap-8">
        {contests.map((contest) => {
          const categoryInfo = contestCategories[contest.category];
          const IconComponent = categoryInfo?.icon || Trophy;
          return (
            <div key={contest.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full bg-${categoryInfo?.color || 'gray'}-100`}>
                      <IconComponent className={`w-6 h-6 text-${categoryInfo?.color || 'gray'}-600`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{categoryInfo?.name || 'Contest'} Contest</h3>
                      <p className="text-gray-600">Contest #{contest.id} • Created by {contest.owner}</p>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{contest.submissions.length}</p>
                    <p className="text-sm text-gray-600">Submissions</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">6d</p>
                    <p className="text-sm text-gray-600">Time Left</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedContest(contest);
                    setCurrentPage('contest-detail');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  View Contest & Submit Meme
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Meme CTA if no memes */}
      {userMemes.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl mt-8">
          <Plus className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No memes created yet</h3>
          <p className="text-gray-500 mb-4">Create your first meme to participate in contests!</p>
          <button 
            onClick={() => setCurrentPage('create-meme')}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Create Your First Meme
          </button>
        </div>
      )}
    </div>
  );

  // Contest Detail Page
  const ContestDetailPage = () => {
    const [memeUrl, setMemeUrl] = useState('');
    const [selectedMemeId, setSelectedMemeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [userVotes, setUserVotes] = useState({});

    if (!selectedContest) return <div>Contest not found</div>;

    const categoryInfo = contestCategories[selectedContest.category];
    const IconComponent = categoryInfo?.icon || Trophy;

    // Filter user memes that match the contest category
    const categoryMemes = userMemes.filter(meme => meme.category === selectedContest.category);

    const submitMeme = async () => {
      const memeToSubmit = memeUrl || (selectedMemeId ? userMemes.find(m => m.id == selectedMemeId)?.imageUrl : '');
      
      if (!memeToSubmit) {
        alert('Please enter a meme URL or select one of your created memes');
        return;
      }
      
      setLoading(true);
      
      // Simulate blockchain transaction
      setTimeout(() => {
        const newSubmission = {
          id: selectedContest.submissions.length,
          address: walletAddress,
          imageUrl: memeToSubmit,
          votes: 0,
          timestamp: Date.now()
        };
        
        const updatedContest = {
          ...selectedContest,
          submissions: [...selectedContest.submissions, newSubmission],
          prizePool: selectedContest.prizePool + selectedContest.submissionFee
        };
        
        setContests(contests.map(c => c.id === selectedContest.id ? updatedContest : c));
        setSelectedContest(updatedContest);
        setMemeUrl('');
        setSelectedMemeId('');
        setLoading(false);
        alert('Meme submitted successfully! Entry fee added to prize pool.');
      }, 1500);
    };

    const voteForMeme = (submissionId) => {
      if (userVotes[submissionId]) {
        alert('You have already voted for this meme!');
        return;
      }
      
      const updatedSubmissions = selectedContest.submissions.map(submission =>
        submission.id === submissionId 
          ? { ...submission, votes: submission.votes + 1 }
          : submission
      );
      
      const updatedContest = {
        ...selectedContest,
        submissions: updatedSubmissions
      };
      
      setContests(contests.map(c => c.id === selectedContest.id ? updatedContest : c));
      setSelectedContest(updatedContest);
      setUserVotes({ ...userVotes, [submissionId]: true });
      alert('Vote cast successfully!');
    };

    const sortedSubmissions = [...selectedContest.submissions].sort((a, b) => b.votes - a.votes);

    return (
      <div className="max-w-7xl mx-auto p-6">
        <BackButton to="view-contests" />
        
        {/* Contest Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-4 rounded-full bg-${categoryInfo?.color || 'gray'}-100`}>
              <IconComponent className={`w-8 h-8 text-${categoryInfo?.color || 'gray'}-600`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{categoryInfo?.name || 'Contest'} Contest</h1>
              <p className="text-gray-600">Contest #{selectedContest.id} • Compete for {selectedContest.prizePool} APT</p>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Submit Meme Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-purple-600" />
                Submit Your Meme
              </h3>
              
              <div className="space-y-4">
                {/* Select from category-matching created memes */}
                {categoryMemes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select from your {categoryInfo?.name} memes
                    </label>
                    <select 
                      value={selectedMemeId}
                      onChange={(e) => {
                        setSelectedMemeId(e.target.value);
                        if (e.target.value) setMemeUrl('');
                      }}
                      className="w-full p-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="">Choose a meme...</option>
                      {categoryMemes.map(meme => (
                        <option key={meme.id} value={meme.id}>
                          {meme.title}
                        </option>
                      ))}
                    </select>
                    
                    {selectedMemeId && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Selected meme:</p>
                        <img 
                          src={userMemes.find(m => m.id == selectedMemeId)?.imageUrl} 
                          alt="Selected meme" 
                          className="w-full rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="text-center text-sm text-gray-500 my-2">— OR —</div>
                  </div>
                )}

                {categoryMemes.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      You don't have any {categoryInfo?.name} memes yet. Create one first or enter a URL below.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Enter meme URL</label>
                  <input 
                    type="url" 
                    value={memeUrl}
                    onChange={(e) => {
                      setMemeUrl(e.target.value);
                      if (e.target.value) setSelectedMemeId('');
                    }}
                    className="w-full p-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="https://i.imgflip.com/..."
                    disabled={selectedMemeId !== ''}
                  />
                  
                  {memeUrl && !selectedMemeId && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img 
                        src={memeUrl} 
                        alt="Meme preview" 
                        className="w-full rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x150?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Entry Fee:</strong> {selectedContest.submissionFee} APT
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This fee will be added to the prize pool
                  </p>
                </div>
                
                <button 
                  onClick={submitMeme}
                  disabled={(!memeUrl && !selectedMemeId) || loading}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  {loading ? 'Submitting...' : `Submit (${selectedContest.submissionFee} APT)`}
                </button>
              </div>
            </div>
            
            {/* Contest Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Contest Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{categoryInfo?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Prize:</span>
                  <span className="font-semibold text-blue-600">{categoryInfo?.initialPrize} APT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Pool:</span>
                  <span className="font-semibold text-purple-600">{selectedContest.prizePool} APT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-semibold">{selectedContest.submissionFee} APT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submissions:</span>
                  <span className="font-semibold">{selectedContest.submissions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Left:</span>
                  <span className="font-semibold text-red-500">6 days</span>
                </div>
              </div>
            </div>

            {/* Prize Distribution */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Prize Distribution
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">🥇 1st Place:</span>
                  <span className="font-semibold">{(selectedContest.prizePool * 0.6).toFixed(1)} APT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🥈 2nd Place:</span>
                  <span className="font-semibold">{(selectedContest.prizePool * 0.3).toFixed(1)} APT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🥉 3rd Place:</span>
                  <span className="font-semibold">{(selectedContest.prizePool * 0.1).toFixed(1)} APT</span>
                </div>
              </div>
            </div>

            {/* Create Category Meme CTA */}
            {categoryMemes.length === 0 && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-lg p-6 text-center">
                <IconComponent className={`w-8 h-8 text-${categoryInfo?.color || 'gray'}-500 mx-auto mb-3`} />
                <h4 className="font-bold mb-2">Need {categoryInfo?.name} Memes?</h4>
                <p className="text-sm text-gray-600 mb-3">Create memes for this category</p>
                <button 
                  onClick={() => setCurrentPage('create-meme')}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Create Meme
                </button>
              </div>
            )}
          </div>
          
          {/* Memes Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Contest Submissions</h3>
              <div className="text-sm text-gray-600">
                Total Votes: {selectedContest.submissions.reduce((sum, sub) => sum + sub.votes, 0)}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedSubmissions.map((submission, index) => (
                <div key={submission.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
                  {/* Ranking Badge */}
                  {index < 3 && (
                    <div className="absolute z-10 top-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        'bg-orange-300 text-orange-900'
                      }`}>
                        {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : '🥉 3rd'}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <img 
                      src={submission.imageUrl} 
                      alt={`Meme by ${submission.address}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x200?text=Meme+${submission.id}`;
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600 font-mono">
                        {submission.address.slice(0, 8)}...{submission.address.slice(-6)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          submission.votes >= 10 ? 'bg-red-100 text-red-800' :
                          submission.votes >= 5 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {submission.votes} votes
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => voteForMeme(submission.id)}
                        disabled={userVotes[submission.id] || submission.address === walletAddress}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                          userVotes[submission.id] 
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : submission.address === walletAddress
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105'
                        }`}
                      >
                        {userVotes[submission.id] 
                          ? '✓ Voted' 
                          : submission.address === walletAddress 
                            ? 'Your Meme' 
                            : '👍 Vote'
                        }
                      </button>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Submitted {new Date(submission.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedContest.submissions.length === 0 && (
              <div className="text-center py-12">
                <IconComponent className={`w-16 h-16 text-${categoryInfo?.color || 'gray'}-300 mx-auto mb-4`} />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No submissions yet</h3>
                <p className="text-gray-400">Be the first to submit a {categoryInfo?.name} meme!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Leaderboard Page
  const LeaderboardPage = () => {
    // Calculate user stats from all contests
    const userStats = {};
    
    contests.forEach(contest => {
      contest.submissions.forEach(submission => {
        if (!userStats[submission.address]) {
          userStats[submission.address] = {
            address: submission.address,
            totalVotes: 0,
            totalSubmissions: 0,
            contests: 0,
            categories: new Set()
          };
        }
        userStats[submission.address].totalVotes += submission.votes;
        userStats[submission.address].totalSubmissions += 1;
        userStats[submission.address].categories.add(contest.category);
      });
    });

    // Add contest participation count
    contests.forEach(contest => {
      const participantAddresses = [...new Set(contest.submissions.map(s => s.address))];
      participantAddresses.forEach(address => {
        if (userStats[address]) {
          userStats[address].contests += 1;
        }
      });
    });

    const leaderboard = Object.values(userStats)
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 10);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <BackButton />
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h2>
          <p className="text-gray-600">Top meme creators across all categories</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
            <div className="grid grid-cols-6 gap-4 font-semibold">
              <div>Rank</div>
              <div>Address</div>
              <div className="text-center">Total Votes</div>
              <div className="text-center">Submissions</div>
              <div className="text-center">Contests</div>
              <div className="text-center">Categories</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {leaderboard.map((user, index) => (
              <div key={user.address} className={`p-4 hover:bg-gray-50 ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
              }`}>
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index >= 3 && <span className="font-bold text-gray-500">#{index + 1}</span>}
                  </div>
                  <div className="font-mono text-sm">
                    {user.address.slice(0, 8)}...{user.address.slice(-6)}
                    {user.address === walletAddress && (
                      <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">You</span>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-purple-600">{user.totalVotes}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold">{user.totalSubmissions}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-blue-600">{user.contests}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-green-600">{user.categories.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No data yet</h3>
            <p className="text-gray-400">Create and participate in contests to see the leaderboard!</p>
          </div>
        )}
      </div>
    );
  };

  // Main Render
  if (!walletConnected) {
    return <WalletConnectPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'create-meme' && <CreateMemePage />}
      {currentPage === 'view-contests' && <ViewContestsPage />}
      {currentPage === 'contest-detail' && <ContestDetailPage />}
      {currentPage === 'leaderboard' && <LeaderboardPage />}
    </div>
  );
};

export default MemeContestApp;