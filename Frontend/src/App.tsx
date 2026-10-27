
import { useMemo, useState } from 'react'
import './App.css'

type Message = {
  id: number
  text: string
  mine: boolean
  time: string
}

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
    id: 1,
    name: 'Aarav Sharma',
    username: '@aarav',
    avatar: 'AS',
    color: 'violet',
    online: true,
    lastMessage: 'Bro, that looks amazing 🔥',
    time: 'Now',
    unread: 2,
    messages: [
      { id: 1, text: 'Hey bro! What’s up?', mine: false, time: '10:40 AM' },
      { id: 2, text: 'All good! Just building something cool.', mine: true, time: '10:41 AM' },
      { id: 3, text: 'Is it the new ATOMOU project?', mine: false, time: '10:41 AM' },
      { id: 4, text: 'Yes! It’s finally coming together 🚀', mine: true, time: '10:42 AM' },
      { id: 5, text: 'Bro, that looks amazing 🔥', mine: false, time: '10:43 AM' },
    ],
  },
  {
    id: 2,
    name: 'Priya Verma',
    username: '@priya',
    avatar: 'PV',
    color: 'pink',
    online: true,
    lastMessage: 'See you tomorrow ✨',
    time: '9:42 AM',
    unread: 1,
    messages: [
      { id: 1, text: 'Hey! Are we still meeting tomorrow?', mine: false, time: '9:40 AM' },
      { id: 2, text: 'Of course! See you tomorrow ✨', mine: true, time: '9:42 AM' },
    ],
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    username: '@rohan',
    avatar: 'RM',
    color: 'blue',
    online: false,
    lastMessage: 'Sent you the playlist 🎧',
    time: '9:15 AM',
    unread: 0,
    messages: [
      { id: 1, text: 'You need new music for your gym sessions.', mine: false, time: '9:12 AM' },
      { id: 2, text: 'Absolutely. Send me something good!', mine: true, time: '9:13 AM' },
      { id: 3, text: 'Sent you the playlist 🎧', mine: false, time: '9:15 AM' },
    ],
  },
  {
    id: 4,
    name: 'Ananya Singh',
    username: '@ananya',
    avatar: 'AN',
    color: 'orange',
    online: true,
    lastMessage: 'Haha, exactly 😂',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, text: 'That was the funniest thing ever 😂', mine: false, time: 'Yesterday' },
      { id: 2, text: 'Haha, exactly 😂', mine: true, time: 'Yesterday' },
    ],
  },
  {
    id: 5,
    name: 'Dev Patel',
    username: '@dev',
    avatar: 'DP',
    color: 'green',
    online: false,
    lastMessage: 'Let’s catch up soon.',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, text: 'It has been a while!', mine: false, time: 'Yesterday' },
      { id: 2, text: 'Let’s catch up soon.', mine: true, time: 'Yesterday' },
    ],
  },
]

const navItems = [
  { id: 'chats', icon: '◫', label: 'Messages' },
  { id: 'friends', icon: '♧', label: 'Friends' },
  { id: 'stories', icon: '◉', label: 'Stories' },
]

function App() {
  const [chats, setChats] = useState(initialChats)
  const [activeId, setActiveId] = useState(1)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [activeNav, setActiveNav] = useState('chats')
  const [showProfile, setShowProfile] = useState(false)

  const activeChat = chats.find((chat) => chat.id === activeId) ?? chats[0]

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        `${chat.name} ${chat.username}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [chats, search],
  )

  function sendMessage() {
    const text = draft.trim()
    if (!text || !activeChat) return

    const now = new Date()
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    setChats((current) =>
      current.map((chat) =>
        chat.id === activeId
          ? {
              ...chat,
              lastMessage: text,
              time: 'Now',
              messages: [
                ...chat.messages,
                { id: Date.now(), text, mine: true, time },
              ],
            }
          : chat,
      ),
    )
    setDraft('')
  }

  function handleNav(id: string) {
    setActiveNav(id)
    if (id === 'friends') setSearch('')
  }

  return (
    <main className="app-shell">
      <aside className="rail">
        <button className="brand-mark" aria-label="ATOMOU home" onClick={() => handleNav('chats')}>
          <span className="brand-symbol">a</span>
        </button>

        <div className="rail-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`rail-button ${activeNav === item.id ? 'selected' : ''}`}
              onClick={() => handleNav(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <span className="rail-icon">{item.icon}</span>
              <span className="rail-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="rail-bottom">
          <button
            className="rail-button settings-button"
            title="Profile"
            aria-label="Profile"
            onClick={() => setShowProfile((value) => !value)}
          >
            <span className="avatar avatar-self">N</span>
          </button>
          {showProfile && (
            <div className="profile-popover">
              <strong>Nitish</strong>
              <span>@nitish</span>
              <small>ATOMOU member</small>
            </div>
          )}
          <span className="rail-version">v0.1</span>
        </div>
      </aside>

      <section className="sidebar">
        <header className="sidebar-header">
          <div>
            <p className="eyebrow">YOUR SPACE</p>
            <h1>{activeNav === 'friends' ? 'Friends' : activeNav === 'stories' ? 'Stories' : 'Messages'}<span className="heading-dot">.</span></h1>
          </div>
          <button className="icon-button new-chat" title="New message" onClick={() => setSearch('')} aria-label="New message">
            +
          </button>
        </header>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={activeNav === 'friends' ? 'Find a friend...' : 'Search conversations...'}
            aria-label="Search conversations"
          />
          <kbd>⌘ K</kbd>
        </div>

        {activeNav === 'stories' ? (
          <div className="stories-area">
            <p className="section-label">RECENT STORIES</p>
            {chats.filter((chat) => chat.online).map((chat) => (
              <button className="story-row" key={chat.id} onClick={() => { setActiveId(chat.id); setActiveNav('chats') }}>
                <span className={`story-ring ${chat.color}`}><span className={`avatar ${chat.color}`}>{chat.avatar}</span></span>
                <span>{chat.name.split(' ')[0]}</span>
                <span className="story-new">NEW</span>
              </button>
            ))}
            <p className="story-note">More stories will appear here when your friends share them.</p>
          </div>
        ) : (
          <>
            <div className="section-heading">
              <p className="section-label">{activeNav === 'friends' ? 'YOUR FRIENDS' : 'ALL MESSAGES'}</p>
              <span>{filteredChats.length.toString().padStart(2, '0')}</span>
            </div>

            <div className="chat-list">
              {filteredChats.map((chat) => (
                <button
                  className={`chat-row ${activeId === chat.id && activeNav === 'chats' ? 'active' : ''}`}
                  key={chat.id}
                  onClick={() => { setActiveId(chat.id); setActiveNav('chats') }}
                >
                  <span className={`avatar-wrap ${chat.color}`}>
                    <span className={`avatar ${chat.color}`}>{chat.avatar}</span>
                    {chat.online && <span className="online-dot" />}
                  </span>
                  <span className="chat-row-copy">
                    <span className="chat-row-top">
                      <strong>{chat.name}</strong>
                      <time>{chat.time}</time>
                    </span>
                    <span className="chat-preview">{activeNav === 'friends' ? chat.username : chat.lastMessage}</span>
                  </span>
                  {chat.unread > 0 && activeNav === 'chats' && <span className="unread-count">{chat.unread}</span>}
                </button>
              ))}
              {filteredChats.length === 0 && <p className="empty-search">No conversations found.</p>}
            </div>
          </>
        )}

        <footer className="sidebar-footer">
          <span className="footer-pulse" />
          <span>Everything feels closer here.</span>
        </footer>
      </section>

      <section className="conversation">
        {activeChat ? (
          <>
            <header className="conversation-header">
              <div className="conversation-person">
                <span className={`avatar-wrap ${activeChat.color}`}>
                  <span className={`avatar ${activeChat.color}`}>{activeChat.avatar}</span>
                  {activeChat.online && <span className="online-dot" />}
                </span>
                <div>
                  <h2>{activeChat.name}</h2>
                  <p><span className={`status-dot ${activeChat.online ? 'online' : ''}`} />{activeChat.online ? 'Online now' : 'Offline'} <span className="handle">{activeChat.username}</span></p>
                </div>
              </div>
              <div className="header-actions">
                <button className="icon-button" title="Search messages" aria-label="Search messages" onClick={() => document.querySelector<HTMLInputElement>('.search-box input')?.focus()}>⌕</button>
                <button className="icon-button" title="More options" aria-label="More options" onClick={() => window.alert('More conversation options coming soon.')}>···</button>
              </div>
            </header>

            <div className="chat-canvas">
              <div className="date-divider"><span>TODAY</span></div>
              <div className="message-list">
                {activeChat.messages.map((message, index) => {
                  const previous = activeChat.messages[index - 1]
                  const showAvatar = !message.mine && (!previous || previous.mine)
                  return (
                    <div className={`message-line ${message.mine ? 'mine' : 'theirs'}`} key={message.id}>
                      {!message.mine && (
                        <span className={`mini-avatar ${activeChat.color} ${showAvatar ? '' : 'invisible'}`}>
                          {activeChat.avatar}
                        </span>
                      )}
                      <div className="message-content">
                        <div className={`message-bubble ${message.mine ? 'mine-bubble' : 'their-bubble'}`}>
                          {message.text}
                        </div>
                        <span className="message-time">{message.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="conversation-end">
                <span className={`avatar ${activeChat.color}`}>{activeChat.avatar}</span>
                <p>You’re all caught up with <strong>{activeChat.name.split(' ')[0]}</strong>.</p>
                <span>Keep the good energy going ✦</span>
              </div>
            </div>

            <form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
              <button type="button" className="composer-tool" title="Add attachment" aria-label="Add attachment" onClick={() => window.alert('Media sharing will be added when the backend is connected.')}>＋</button>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Message ${activeChat.name.split(' ')[0]}...`}
                aria-label="Write a message"
              />
              <span className="composer-hint">Enter ↵</span>
              <button className="send-button" type="submit" disabled={!draft.trim()} aria-label="Send message">
                <span>↑</span>
              </button>
            </form>
            <p className="encryption-note"><span>✳</span> Good conversations, better connections.</p>
          </>
        ) : (
          <div className="empty-state"><h2>No conversation selected</h2><p>Choose a friend to start chatting.</p></div>
        )}
      </section>
    </main>
  )
}

export default App
