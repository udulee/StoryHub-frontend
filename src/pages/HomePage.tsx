import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchStories } from '../redux/slices/storySlice';
import StoryCard from '../components/story/StoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Story } from '../types';

const CATEGORIES = ['All', 'Fantasy', 'Romance', 'Horror', 'Mystery', 'Action', 'Webtoon'];

const CATEGORY_ICONS: Record<string, string> = {
  All: '✦', Fantasy: '🔮', Romance: '💖', Horror: '💀', Mystery: '🔍', Action: '⚡', Webtoon: '🎨',
};

const COVER_GRADIENTS: Record<string, string> = {
  Fantasy: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  Romance:  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  Horror:   'linear-gradient(135deg, #2d3436 0%, #d63031 100%)',
  Mystery:  'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  Action:   'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  Webtoon:  'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
};

// ── Demo PDF stories (Updated with Black Kitty and Maya) ────────────────────────
const DEMO_STORIES = [
  {
    id: 'maya-1',
    title: 'මායා (Maya)',
    subtitle: 'අඳුරු රාත්‍රියක අභිරහස් ලෝකය',
    author: 'එච්. කේ. පවිත්‍රා මානසී සමරසේකර',
    category: 'Fantasy', // Fantasy, Horror සහ All වල පෙන්වීමට logic එක පහතින් හදා ඇත
    secondaryCategory: 'Horror', // Horror වලටත් අයිති නිසා
    description: 'අඳුරුම අඳුරු අමාවක මහ රෑක, මහා වැසි සහ කුණාටු මැද පාළු පළාතකින් ඇසුණු අද්භූත ගැහැණු ළමයෙකුගේ කටහඬ... මායා ලෝකයේ සිදුවූ සිදුවීම් සහ අද්භූත බලපෑම් මැද, තමන්ගේ මතකයන් පවා අහිමි කරගනිමින් දුක් විඳින්නට සිදුවූ මායාගේ සහ ඇය වටා ගෙතුණු අද්භූත, කුතුහලයෙන් පිරි මායාවී කතාවක්.',
    category_label: 'Fantasy / Horror',
    pages: 132, // දළ වශයෙන් පිටු ගණන
    pdf: '/Maya-Manasi-Samarsekara-sinhalaebooks.com.pdf.pdf',
    gradient: 'linear-gradient(135deg, #0d001a 0%, #26004d 50%, #4d0099 100%)', // Deep mystical purple/dark theme for Maya
    badge: '✨ මායා ලෝකය',
    tag: 'Fantasy & Horror',
  },
  {
    id: 'black-kitty-1',
    title: 'බ්ලැක් කිටී (Black Kitty)',
    subtitle: 'ඒජන්ට් දිනේෂාගේ රහස් මෙහෙයුම',
    author: 'එච්.ජී.ජනුදි ජයශංකි',
    category: 'Romance',
    secondaryCategory: 'Action',
    description: 'CID කාරියවසම් ලොක්කා යටතේ රහසිගත මෙහෙයුමක යෙදෙන දිනේෂා (දිනූ) සහ ධනුෂ්. අසාධාරණය පෙනෙන්නට බැරි දිනූ, රාත්‍රියේදී "බ්ලැක් කිටී" ලෙස වෙස්වලාගෙන අසරණ ගැහැණු ළමයින් බේරාගැනීමට ඉදිරිපත් වෙයි. ඇය කෙරෙහි සඟවාගත් ආදරයෙන් පසුවන ධනුෂ් සහ දිනූ වටා ගෙතුණු කුතුහලයෙන් පිරි ආදර කතාවක්.',
    category_label: 'Romance',
    pages: 41,
    pdf: '/Black-Kitty-sinhalaebooks.com.pdf',
    gradient: 'linear-gradient(135deg, #111111 0%, #434343 50%, #d63031 100%)',
    badge: '🐈‍⬛ සිංහල Novel',
    tag: 'Action & Romance',
  },
  {
    id: 'demo-1',
    title: 'අභ්‍යවකාශයේ කඳුළු',
    subtitle: 'කාලයේ අවසාන මිනිස්සු',
    author: 'Dilum Adeesha',
    category: 'Fantasy',
    description: 'තරු අතර අහිමි වූ මිනිස් හදවත් පිළිබඳ කතාවක්. NASA ගගනගාමියෙකු සහ ඔහුගේ දියණිය වර්ම්හෝල් එකක් හරහා වසර මිලියන 3ක අනාගතයට ගමන් කරති.',
    category_label: 'Fantasy',
    pages: 35,
    pdf: '/Abhyawakashaye-Kandulu.pdf',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    badge: '🌟 සිංහල',
    tag: 'Sci-Fi',
  },
  {
    id: 'demo-2',
    title: 'Tears in Space',
    subtitle: 'The Last Humans',
    author: 'Dilum Adeesha',
    category: 'Mystery',
    description: 'A Sinhala sci-fi masterpiece — astronauts lost in a wormhole discover Earth 3.4 million years in the future. A story of love, sacrifice, and humanity\'s last hope.',
    category_label: 'Mystery',
    pages: 35,
    pdf: '/Abhyawakashaye-Kandulu.pdf',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    badge: '📖 English',
    tag: 'Space Opera',
  },
  {
    id: 'demo-3',
    title: 'MBOT — The AI Friend',
    subtitle: 'Chapter 6 Preview',
    author: 'Dilum Adeesha',
    category: 'Fantasy',
    description: 'Kore-101 becomes Mbot — the most lovable robot crew member ever written. Read Chapter 6 where alien creatures, secret pregnancies and an AI heart will move you.',
    category_label: 'Fantasy',
    pages: 35,
    pdf: '/Abhyawakashaye-Kandulu.pdf',
    gradient: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
    badge: '🤖 AI Story',
    tag: 'Sci-Fi',
  },
  {
    id: 'demo-4',
    title: 'The Wormhole Chronicle',
    subtitle: 'Year 3,487,229 AD',
    author: 'Dilum Adeesha',
    category: 'Action',
    description: 'They traveled through a wormhole expecting to reach Uranus — instead they found themselves 3.4 million years in the future on a dead Earth. Download the full PDF.',
    category_label: 'Action',
    pages: 35,
    pdf: '/Abhyawakashaye-Kandulu.pdf',
    gradient: 'linear-gradient(135deg, #7f0000 0%, #200122 100%)',
    badge: '🔥 HOT',
    tag: 'Adventure',
  },
];

// ── PDF Demo Card ────────────────────────────────────────────────────────────
const PDFCard: React.FC<{ story: typeof DEMO_STORIES[0]; onOpen: () => void }> = ({ story, onOpen }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#2A2A3D',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.5)' : '0 2px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Cover */}
      <div style={{
        height: '200px',
        background: story.gradient,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Stars bg effect */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.4,
        }} />

        {/* Glow center */}
        <div style={{
          position: 'absolute',
          width: '120px', height: '120px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '50%',
          filter: 'blur(20px)',
        }} />

        {/* Title overlay */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 12px', zIndex: 2 }}>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '10px',
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            {story.badge}
          </p>
          <h3 style={{
            color: '#fff', fontWeight: 800, fontSize: '15px',
            lineHeight: 1.3, textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}>
            {story.title}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '4px' }}>
            {story.subtitle}
          </p>
        </div>

        {/* Bottom badges */}
        <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
          <span style={{
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            color: '#fff', fontSize: '9px', fontWeight: 700,
            padding: '3px 7px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {CATEGORY_ICONS[story.category]} {story.category}
          </span>
          <span style={{
            background: 'rgba(255,103,64,0.8)',
            color: '#fff', fontSize: '9px', fontWeight: 700,
            padding: '3px 7px', borderRadius: '4px',
          }}>
            {story.pages} pages
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ color: '#6B6B8A', fontSize: '11px', margin: 0 }}>
          by <span style={{ color: '#FF6740', fontWeight: 600 }}>{story.author}</span>
          <span style={{ marginLeft: '8px', background: '#3A3A55', color: '#aaa', fontSize: '9px', padding: '2px 6px', borderRadius: '3px' }}>
            {story.tag}
          </span>
        </p>
        <p style={{
          color: '#8888A8', fontSize: '11px', margin: 0,
          lineHeight: 1.55, overflow: 'hidden',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>
          {story.description}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
          <button
            onClick={onOpen}
            style={{
              flex: 1, padding: '9px 0',
              background: 'linear-gradient(135deg, #6C63FF, #FF6740)',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontWeight: 700, fontSize: '12px', cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            📖 කියවන්න (Read)
          </button>
          <a
            href={story.pdf}
            download={story.title}
            style={{
              flex: 1, padding: '9px 0',
              background: '#2A2A3D', border: '1.5px solid #3A3A55',
              color: '#aaa', borderRadius: '8px',
              fontWeight: 600, fontSize: '12px', cursor: 'pointer',
              textDecoration: 'none', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#FF6740'; (e.currentTarget as HTMLAnchorElement).style.color = '#FF6740'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3A3A55'; (e.currentTarget as HTMLAnchorElement).style.color = '#aaa'; }}
          >
            ⬇ PDF
          </a>
        </div>
      </div>
    </div>
  );
};

// ── PDF Reader Modal ─────────────────────────────────────────────────────────
const PDFModal: React.FC<{ story: typeof DEMO_STORIES[0]; onClose: () => void }> = ({ story, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column',
  }}>
    {/* Header */}
    <div style={{
      background: '#1C1C28', borderBottom: '1px solid #2A2A3D',
      padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        <h3 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: 700 }}>{story.title}</h3>
        <p style={{ color: '#FF6740', margin: 0, fontSize: '12px' }}>by {story.author}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <a
          href={story.pdf}
          download={story.title}
          style={{
            background: '#FF6740', color: '#fff', padding: '8px 16px',
            borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700,
          }}
        >
          ⬇ Download PDF
        </a>
        <button
          onClick={onClose}
          style={{
            background: '#2A2A3D', border: '1px solid #3A3A55',
            color: '#aaa', width: '36px', height: '36px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>
    </div>

    {/* PDF Viewer */}
    <iframe
      src={`${story.pdf}#toolbar=1`}
      style={{ flex: 1, border: 'none', width: '100%' }}
      title={story.title}
    />
  </div>
);

// ── Wattpad-style card (for backend stories) ─────────────────────────────────
const WattpadCard: React.FC<{ story: Story }> = ({ story }) => {
  const author = typeof story.author === 'object' ? story.author.username : 'Unknown';
  const gradient = COVER_GRADIENTS[story.category] || 'linear-gradient(135deg,#6C63FF,#e94560)';
  const [hovered, setHovered] = useState(false);

  return (
    <a href={`/story/${story._id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#2A2A3D', borderRadius: '12px', overflow: 'hidden',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div style={{
          height: '200px', background: gradient, position: 'relative', flexShrink: 0,
          display: 'flex', alignItems: 'flex-end', padding: '12px',
        }}>
          <span style={{
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
            color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px',
          }}>
            {CATEGORY_ICONS[story.category]} {story.category}
          </span>
        </div>
        <div style={{ padding: '14px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{
            color: '#FFFFFF', fontWeight: 700, fontSize: '14px', lineHeight: 1.35, margin: 0,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>{story.title}</h3>
          <p style={{ color: '#6B6B8A', fontSize: '12px', margin: 0 }}>
            by <span style={{ color: '#FF6740' }}>{author}</span>
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '8px' }}>
            <span style={{ color: '#6B6B8A', fontSize: '11px' }}>👁 {story.views.toLocaleString()}</span>
            <span style={{ color: '#6B6B8A', fontSize: '11px' }}>❤️ {story.likes.length}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stories, isLoading } = useAppSelector(s => s.story);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [openPDF,  setOpenPDF]  = useState<typeof DEMO_STORIES[0] | null>(null);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search)             params.search   = search;
    if (category !== 'All') params.category = category;
    dispatch(fetchStories(params));
  }, [dispatch, search, category]);

  // Filter demo stories by category/search (Updated logic to check secondary categories)
  const filteredDemo = DEMO_STORIES.filter(s => {
    const matchCat = category === 'All' || s.category === category || s.secondaryCategory === category;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', color: '#fff' }}>
      {openPDF && <PDFModal story={openPDF} onClose={() => setOpenPDF(null)} />}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 60px' }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #13131f 0%, #1e1e30 100%)',
          borderRadius: '0 0 24px 24px',
          padding: '48px 20px 40px',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#FF6740', fontWeight: 700, fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
            ✦ Your next favourite read awaits
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.1 }}>
            Stories that pull you in
          </h1>
          <p style={{ color: '#6B6B8A', fontSize: '16px', marginBottom: '28px' }}>
            Discover novels, webtoons & short stories from independent writers
          </p>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '500px' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#6B6B8A', fontSize: '16px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search stories, authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '14px 20px 14px 46px',
                background: '#2A2A3D', border: '1.5px solid #3A3A55',
                borderRadius: '50px', color: '#fff', fontSize: '15px', outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = '#FF6740')}
              onBlur={e =>  (e.target.style.borderColor = '#3A3A55')}
            />
          </div>
        </div>

        {/* ── Category Pills ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '8px 20px', borderRadius: '50px',
              border: category === cat ? 'none' : '1.5px solid #3A3A55',
              background: category === cat ? '#FF6740' : 'transparent',
              color: category === cat ? '#fff' : '#8888A8',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* ── Featured PDF Stories (demo) ── */}
        {filteredDemo.length > 0 && (
          <section style={{ marginBottom: '52px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontWeight: 800, fontSize: '20px', margin: 0 }}>📚 Featured Stories</h2>
              <span style={{ background: '#FF6740', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>
                PDF Available
              </span>
              <div style={{ flex: 1, height: '1px', background: '#2A2A3D' }} />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
            }}>
              {filteredDemo.map(story => (
                <PDFCard key={story.id} story={story} onOpen={() => setOpenPDF(story)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Backend Stories Grid ── */}
        {isLoading ? <LoadingSpinner /> : stories.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontWeight: 800, fontSize: '20px', margin: 0 }}>
                {category === 'All' ? '✦ All Stories' : `${CATEGORY_ICONS[category]} ${category}`}
              </h2>
              <span style={{ color: '#6B6B8A', fontSize: '14px' }}>({stories.length})</span>
              <div style={{ flex: 1, height: '1px', background: '#2A2A3D' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
              {stories.map(story => <WattpadCard key={story._id} story={story} />)}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!isLoading && stories.length === 0 && filteredDemo.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B8A' }}>
            <p style={{ fontSize: '56px', marginBottom: '16px' }}>📖</p>
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>No stories found</p>
            <p style={{ fontSize: '14px' }}>Try a different category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;