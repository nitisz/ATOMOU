import { useEffect, useMemo, useState } from 'react'
import AuthScreen from './AuthScreen'
import type { AuthUser } from './api/auth'
import './App.css'

type Message = { id: number; text: string; mine: boolean; time: string }
type Chat = {
  id: number
  name: string
  username: string
  avatar: string
  color: string
  online: boolean
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

const initialChats: Chat[] = [
  {
    id: 1, name: 'Aarav Sharma', username: '@aarav', avatar: 'AS', color: 'violet',
    online: true, lastMessage: 'Bro, that looks amazing 🔥', time: '2:45 PM', unread: 2,
    messages: [
      { id: 1, text: "Hey bro! What's up?", mine: false, time: '2:30 PM' },
      { id: 2, text: 'All good! Just building something cool.', mine: true, time: '2:31 PM' },
      { id: 3, text: 'Is this new ATOMOU project?', mine: false, time: '2:32 PM' },
      { id: 4, text: "Yeah! It's finally coming together. 🚀", mine: true, time: '2:36 PM' },
      { id: 5, text: 'Bro, that looks amazing! 🔥', mine: false, time: '2:40 PM' },
    ],
  },
  {
    id: 2, name: 'Priya Verma', username: '@priya', avatar: 'PV', color: 'pink',
    online: true, lastMessage: 'Sounds good! 👍', time: '1:20 PM', unread: 1,
    messages: [
      { id: 1, text: 'Hey! Are we still meeting tomorrow?', mine: false, time: '1:18 PM' },
      { id: 2, text: 'Of course! Sounds good! 👍', mine: true, time: '1:20 PM' },
    ],
  },
  {
    id: 3, name: 'Rohan Mehta', username: '@rohan', avatar: 'RM', color: 'blue',
    online: true, lastMessage: "I'll be there in 10 mins", time: '11:32 AM', unread: 0,
    messages: [
      { id: 1, text: 'You need new music for your gym sessions.', mine: false, time: '11:30 AM' },
      { id: 2, text: "I'll be there in 10 mins", mine: true, time: '11:32 AM' },
    ],
  },
  {
    id: 4, name: 'Ananya Singh', username: '@ananya', avatar: 'AN', color: 'orange',
    online: false, lastMessage: 'Okay, see you!', time: 'Yesterday', unread: 0,
    messages: [
      { id: 1, text: 'That was the funniest thing ever 😂', mine: false, time: 'Yesterday' },
      { id: 2, text: 'Okay, see you!', mine: true, time: 'Yesterday' },
    ],
  },
  {
    id: 5, name: 'Dev Patel', username: '@dev', avatar: 'DP', color: 'green',
    online: false, lastMessage: "That's awesome!", time: 'Yesterday', unread: 0,
    messages: [
      { id: 1, text: 'It has been a while!', mine: false, time: 'Yesterday' },
      { id: 2, text: "That's awesome!", mine: true, time: 'Yesterday' },
    ],
  },
]

type NavItem = 'chats' | 'friends' | 'stories'
type FriendFilter = 'all' | 'online' | 'requests'

function MessageIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="message-icon">
      <path d="M16 3.5c-7.1 0-12.5 4.7-12.5 10.8 0 3.6 1.9 6.7 5 8.6v5.6l5.2-3.1c.8.1 1.5.2 2.3.2 7.1 0 12.5-4.7 12.5-10.8S23.1 3.5 16 3.5Z" />
      <circle cx="10.5" cy="14.4" r="1.6" />
      <circle cx="16" cy="14.4" r="1.6" />
      <circle cx="21.5" cy="14.4" r="1.6" />
    </svg>
  )
}

function FriendsPage({ chats, onMessage }: { chats: Chat[]; onMessage: (id: number) => void }) {
  const [filter, setFilter] = useState<FriendFilter>('all')
  const [query, setQuery] = useState('')
  const friends = useMemo(() => chats.filter((chat) => {
    const matchesQuery = `${chat.name} ${chat.username}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'online' && chat.online)
    return matchesQuery && matchesFilter
  }), [chats, filter, query])

  return (
    <section className="feature-page friends-page">
      <header className="feature-header">
        <div><h1>Friends</h1><p>Your people, all in one place</p></div>
        <div className="feature-header-actions">
          <button className="icon-button" aria-label="Search friends" onClick={() => document.querySelector<HTMLInputElement>('.friends-search-input')?.focus()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          </button>
          <button className="icon-button" aria-label="Notifications" title="Notifications">♧</button>
          <span className="avatar avatar-self">N</span>
        </div>
      </header>

      <div className="friends-toolbar">
        <label className="friends-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          <input className="friends-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search friends..." aria-label="Search friends" />
        </label>
        <div className="friends-filters" role="group" aria-label="Friend filters">
          <button className={`friends-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>♧ &nbsp; All Friends <span>{chats.length}</span></button>
          <button className={`friends-filter ${filter === 'online' ? 'active' : ''}`} onClick={() => setFilter('online')}>● &nbsp; Online <span>{chats.filter((chat) => chat.online).length}</span></button>
          <button className={`friends-filter ${filter === 'requests' ? 'active' : ''}`} onClick={() => setFilter('requests')}>♙ &nbsp; Requests <span>0</span></button>
        </div>
      </div>

      {filter === 'requests' ? (
        <div className="friends-empty"><h2>No pending requests</h2><p>New friend requests will appear here.</p></div>
      ) : (
        <div className="friends-grid">
          {friends.map((friend) => (
            <article className="friend-card" key={friend.id}>
              <div className="friend-card-top">
                <span className={`friend-avatar ${friend.color}`}>{friend.avatar}</span>
                <div className="friend-info"><h3>{friend.name}</h3><span className={`friend-status ${friend.online ? 'online' : 'offline'}`}>{friend.online ? 'Online' : 'Offline'}</span>{!friend.online && <small className="friend-last-seen">Last seen yesterday</small>}</div>
                <button className="friend-more" title={`More options for ${friend.name}`} aria-label={`More options for ${friend.name}`}>⋮</button>
              </div>
              <p className="friend-bio">{({
                1: 'Code. Build. Repeat. 🚀',
                2: 'Good vibes only ✨',
                3: "Let's build something great.",
                4: 'Better days ahead. 🌱',
                5: 'Dream. Code. Achieve.',
              } as Record<number, string>)[friend.id]}</p>
              <div className="friend-card-actions">
                <button className="friend-message-button" onClick={() => onMessage(friend.id)}><MessageIcon /> Message</button>
                <button onClick={() => window.alert(`${friend.name}\\nUsername: ${friend.username}\\nStatus: ${friend.online ? 'Online' : 'Offline'}`)}>♙ &nbsp; View Profile</button>
              </div>
            </article>
          ))}
          {friends.length === 0 && <div className="friends-empty"><h2>No friends found</h2><p>Try another name or search term.</p></div>}
        </div>
      )}
    </section>
  )
}

function StoriesPage({ chats }: { chats: Chat[] }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(1)
  const [reply, setReply] = useState('')
  const [liked, setLiked] = useState(false)
  const visibleStories = chats.filter((chat) => `${chat.name} ${chat.username}`.toLowerCase().includes(query.toLowerCase()))
  const selected = chats.find((chat) => chat.id === selectedId) ?? chats[0]

  function moveStory(direction: number) {
    if (!chats.length) return
    const currentIndex = chats.findIndex((chat) => chat.id === selectedId)
    const nextIndex = (currentIndex + direction + chats.length) % chats.length
    setSelectedId(chats[nextIndex].id)
    setLiked(false)
    setReply('')
  }

  return (
    <section className="feature-page stories-page">
      <div className="stories-layout">
        <section className="stories-panel">
          <header className="stories-panel-header"><div><h1>Stories</h1><p>View and share what your friends are up to</p></div><button className="icon-button" title="Add a story" onClick={() => window.alert('Story upload will be available when media uploads are connected.')}>＋</button></header>
          <div className="story-circles">
            <button className="story-circle-item" onClick={() => window.alert('Story upload will be available when media uploads are connected.')}><span className="story-ring your-story-ring"><span className="story-avatar">N<span className="story-plus">＋</span></span></span><span>Your Story</span></button>
            {visibleStories.map((chat) => <button className="story-circle-item" key={chat.id} onClick={() => setSelectedId(chat.id)}><span className="story-ring"><span className={`story-avatar ${chat.color}`}>{chat.avatar.slice(0, 1)}</span></span><span>{chat.name.split(' ')[0]}</span></button>)}
          </div>
          <label className="stories-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories..." aria-label="Search stories" /></label>
          <h2 className="recent-stories-title">Recent Stories</h2>
          <div className="recent-stories-list">
            {visibleStories.map((chat) => <button className={`recent-story-row ${selectedId === chat.id ? 'active' : ''}`} key={chat.id} onClick={() => setSelectedId(chat.id)}><span className="story-ring"><span className={`story-avatar ${chat.color}`}>{chat.avatar.slice(0, 1)}</span></span><span className="recent-story-copy"><strong>{chat.name}</strong><small>{chat.id === 1 ? '2h ago' : `${chat.id * 2}h ago`}</small></span><span className="story-chevron">›</span></button>)}
            {visibleStories.length === 0 && <p className="story-note">No stories found.</p>}
          </div>
          <button className="share-story-button" onClick={() => window.alert('Story upload will be available when media uploads are connected.')}><span className="share-story-icon">▣</span><span><strong>Share a Story</strong><small>Photo or Video</small></span></button>
        </section>

        <section className="story-viewer-panel">
          <header className="story-viewer-heading"><span>‹</span><h2>Stories Dashboard</h2><button className="story-more" aria-label="More story options">•••</button></header>
          {selected && <div className={`story-preview story-background-${selected.id}`}>
            <div className="story-progress"><span /></div>
            <div className="story-owner"><span className={`story-avatar ${selected.color}`}>{selected.avatar.slice(0, 1)}</span><span><strong>{selected.name}</strong><small>{selected.id === 1 ? '2h ago' : `${selected.id * 2}h ago`}</small></span><button className="story-owner-more" aria-label="Story options">•••</button></div>
            <div className="story-preview-controls"><button onClick={() => moveStory(-1)} aria-label="Previous story">‹</button><button onClick={() => moveStory(1)} aria-label="Next story">›</button></div>
            <div className="story-reply"><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Send a message..." aria-label="Reply to story" /><button className={liked ? 'liked' : ''} onClick={() => setLiked((value) => !value)} aria-label="Like story">{liked ? '♥' : '♡'}</button><button onClick={() => { if (reply.trim()) { window.alert('Story reply UI demo: connect the messaging API to send this reply.'); setReply('') } else { moveStory(1) } }} aria-label="Send reply">➤</button></div>
          </div>}
          <aside className="story-viewers"><h3>◉ &nbsp; Viewers ({chats.length + 7})</h3>{chats.map((chat, index) => <div className="story-viewer-row" key={chat.id}><span className={`story-avatar ${chat.color}`}>{chat.avatar.slice(0, 1)}</span><span><strong>{chat.name}</strong><small>Seen {index + 2}h ago</small></span><i className={chat.online ? 'viewer-online' : ''} /></div>)}</aside>
          <aside className="story-your-card"><h3>Your Story</h3><span className="your-story-avatar">N<span>＋</span></span><p>Add a new story</p><button onClick={() => window.alert('Story upload will be available when media uploads are connected.')}>＋ Add story</button></aside>
        </section>
      </div>
    </section>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [activeId, setActiveId] = useState(1)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [activeNav, setActiveNav] = useState<NavItem>('chats')
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('atomou_token')
    const user = sessionStorage.getItem('atomou_user')
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user) as AuthUser)
        setAuthToken(token)
      } catch {
        sessionStorage.removeItem('atomou_token')
        sessionStorage.removeItem('atomou_user')
      }
    }
  }, [])

  function handleAuthenticated(user: AuthUser, token: string) {
    sessionStorage.setItem('atomou_token', token)
    sessionStorage.setItem('atomou_user', JSON.stringify(user))
    setCurrentUser(user)
    setAuthToken(token)
  }

  function handleLogout() {
    sessionStorage.removeItem('atomou_token')
    sessionStorage.removeItem('atomou_user')
    setCurrentUser(null)
    setAuthToken(null)
    setShowProfile(false)
  }

  const activeChat = chats.find((chat) => chat.id === activeId) ?? chats[0]
  const filteredChats = useMemo(
    () => chats.filter((chat) => `${chat.name} ${chat.username}`.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  )

  function sendMessage() {
    const text = draft.trim()
    if (!text || !activeChat) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setChats((current) => current.map((chat) => chat.id === activeId
      ? { ...chat, lastMessage: text, time: 'Now', messages: [...chat.messages, { id: Date.now(), text, mine: true, time }] }
      : chat))
    setDraft('')
  }

  function handleNav(id: NavItem) {
    setActiveNav(id)
    setSearch('')
  }

  if (!currentUser || !authToken) return <AuthScreen onAuthenticated={handleAuthenticated} />

  const initials = (currentUser.displayName || currentUser.username || 'A').trim().charAt(0).toUpperCase()

  return (
    <main className={`app-shell ${activeNav !== 'chats' ? 'feature-shell' : ''}`}>
      <aside className="rail">
        <button className="brand-lockup" aria-label="ATOMOU home" onClick={() => handleNav('chats')}>
          <span className="brand-bubble"><MessageIcon /></span><span className="brand-name">AT<span>O</span>MOU</span><span className="brand-tagline">Chat. Connect. Stay Close.</span>
        </button>
        <nav className="rail-nav" aria-label="Main navigation">
          <button className={`rail-button ${activeNav === 'chats' ? 'selected' : ''}`} onClick={() => handleNav('chats')}><MessageIcon /><span>Messages</span></button>
          <button className={`rail-button ${activeNav === 'friends' ? 'selected' : ''}`} onClick={() => handleNav('friends')}><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="10" r="5" /><path d="M3.5 27v-2.5c0-4.2 3.5-7 8.5-7s8.5 2.8 8.5 7V27M22 6a4.5 4.5 0 0 1 0 8.8M24 18c3.2 1 4.5 3 4.5 6V27" /></svg><span>Friends</span>{activeNav === 'friends' && <span className="nav-count">{chats.length}</span>}</button>
          <button className={`rail-button ${activeNav === 'stories' ? 'selected' : ''}`} onClick={() => handleNav('stories')}><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" /><path d="M16 9v14M9 16h14" /></svg><span>Stories</span></button>
        </nav>
        <div className="rail-bottom">
          {showProfile && <div className="profile-popover"><strong>{currentUser.displayName}</strong><span>@{currentUser.username}</span><small>ATOMOU member</small><button onClick={handleLogout}>Log out</button></div>}
          <button className="profile-button" onClick={() => setShowProfile((value) => !value)} aria-label="Open profile"><span className="avatar avatar-self">{initials}</span><span className="profile-copy"><strong>{currentUser.displayName}</strong><small>@{currentUser.username}</small></span><span className="settings-glyph">⚙</span></button>
        </div>
      </aside>

      {activeNav === 'friends' ? (
        <div className="feature-content"><FriendsPage chats={chats} onMessage={(id) => { setActiveId(id); setActiveNav('chats') }} /></div>
      ) : activeNav === 'stories' ? (
        <div className="feature-content"><StoriesPage chats={chats} /></div>
      ) : (
        <>
          <section className="sidebar">
            <header className="sidebar-header"><div><p className="eyebrow">YOUR SPACE</p><h1>Messages<span className="heading-dot">.</span></h1></div><button className="icon-button new-chat" title="New message" onClick={() => handleNav('friends')} aria-label="New message">＋</button></header>
            <label className="search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." aria-label="Search conversations" /><span className="search-sliders">☷</span></label>
            <div className="section-heading"><p className="section-label">ALL MESSAGES</p><span>{filteredChats.length}</span></div>
            <div className="chat-list">{filteredChats.map((chat) => <button className={`chat-row ${activeId === chat.id ? 'active' : ''}`} key={chat.id} onClick={() => setActiveId(chat.id)}><span className={`avatar-wrap ${chat.color}`}><span className={`avatar ${chat.color}`}>{chat.avatar}</span>{chat.online && <span className="online-dot" />}</span><span className="chat-row-copy"><span className="chat-row-top"><strong>{chat.name}</strong><time>{chat.time}</time></span><span className="chat-preview">{chat.lastMessage}</span></span>{chat.unread > 0 && <span className="unread-count">{chat.unread}</span>}</button>)}{filteredChats.length === 0 && <p className="empty-search">No conversations found.</p>}</div>
            <footer className="sidebar-footer"><span className="footer-pulse" /><span>Everything feels closer here.</span></footer>
          </section>
          <section className="conversation">
            {activeChat ? <><header className="conversation-header"><div className="conversation-person"><span className={`avatar-wrap ${activeChat.color}`}><span className={`avatar ${activeChat.color}`}>{activeChat.avatar}</span>{activeChat.online && <span className="online-dot" />}</span><div><h2>{activeChat.name}</h2><p><span className={`status-dot ${activeChat.online ? 'online' : ''}`} />{activeChat.online ? 'Online now' : 'Offline'}<span className="handle">{activeChat.username}</span></p></div></div><div className="header-actions"><button className="icon-button" title="Focus search" aria-label="Focus search" onClick={() => document.querySelector<HTMLInputElement>('.search-box input')?.focus()}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg></button><button className="icon-button more-button" title="More options" aria-label="More options" onClick={() => setShowProfile((value) => !value)}>•••</button></div></header>
              <div className="chat-canvas"><div className="date-divider"><span>TODAY</span></div><div className="message-list">{activeChat.messages.map((message, index) => { const previous = activeChat.messages[index - 1]; const showAvatar = !message.mine && (!previous || previous.mine); return <div className={`message-line ${message.mine ? 'mine' : 'theirs'}`} key={message.id}>{!message.mine && <span className={`mini-avatar ${activeChat.color} ${showAvatar ? '' : 'invisible'}`}>{activeChat.avatar}</span>}<div className="message-content"><div className={`message-bubble ${message.mine ? 'mine-bubble' : 'their-bubble'}`}>{message.text}</div><span className="message-time">{message.time}{message.mine && <span className="message-check"> ✓✓</span>}</span></div></div>})}</div><div className="conversation-end"><span className="end-icon"><MessageIcon /></span><p>You're all caught up with <strong>{activeChat.name.split(' ')[0]}</strong>.</p><span>Keep the good conversations going! 🙌</span></div></div>
              <form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage() }}><button type="button" className="composer-tool" title="Add attachment" aria-label="Add attachment" onClick={() => window.alert('Media sharing will be added when the backend is connected.')}>＋</button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${activeChat.name.split(' ')[0]}...`} aria-label="Write a message" /><button className="send-button" type="submit" disabled={!draft.trim()} aria-label="Send message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Z" /><path d="M10.1 13.9 21 3" /></svg></button></form><p className="encryption-note">✳ &nbsp; Good conversations, better connections.</p>
            </> : <div className="empty-state"><h2>No conversation selected</h2><p>Choose a friend to start chatting.</p></div>}
          </section>
        </>
      )}
    </main>
  )
}

export default App
