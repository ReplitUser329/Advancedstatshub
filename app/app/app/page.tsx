'use client';

import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  Search, Trophy, Zap, Calendar, Newspaper, Moon, Sun,
  Flame, Shield, Swords 
} from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState('');
  const [player, setPlayer] = useState<any>(null);

  const { data: games } = useSWR('https://www.balldontlie.io/api/v1/games?per_page=20', fetcher, { refreshInterval: 15000 });
  const { data: standings } = useSWR('https://site.api.espn.com/apis/v2/sports/basketball/nba/standings', fetcher, { refreshInterval: 300000 });
  const { data: news } = useSWR('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news', fetcher, { refreshInterval: 300000 });

  const searchPlayer = async () => {
    if (!search.trim()) return;
    const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${encodeURIComponent(search)}`);
    const p = res.data.data[0];
    if (p) {
      const avg = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2024&player_ids[]=${p.id}`);
      setPlayer({ ...p, avg: avg.data.data[0] });
    }
  };

  return (
    <>
      <div className={`${darkMode ? 'bg-gradient-to-br from-dark via-purple-900/20 to-dark' : 'bg-gray-100'} min-h-screen transition-all`}>
        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-neon to-purple bg-clip-text text-transparent">
              NBA NEON
            </h1>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full glass">
              {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Hero Search */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="glass p-10 rounded-3xl text-center">
            <h2 className="text-4xl font-bold mb-8 text-neon">Search Any Player</h2>
            <div className="flex gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="LeBron, Wemby, Jokić..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchPlayer()}
                className="flex-1 px-6 py-4 bg-black/40 border border-neon/50 rounded-2xl text-white focus:outline-none focus:border-neon"
              />
              <button onClick={searchPlayer} className="px-10 py-4 bg-gradient-to-r from-neon to-purple rounded-2xl font-bold hover:scale-105 transition">
                <Search className="inline mr-2" /> GO
              </button>
            </div>

            {player && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
                {[
   { label: "PPG", value: player.avg?.pts || '-', icon: <Flame className="text-orange-500" /> },
   { label: "RPG", value: player.avg?.reb || '-', icon: <Shield className="text-green-500" /> },
   { label: "APG", value: player.avg?.ast || '-', icon: <Zap className="text-yellow-500" /> },
   { label: "FG%", value: player.avg?.fg_pct ? `${(player.avg.fg_pct*100).toFixed(1)}%` : '-', icon: <Swords className="text-pink-500" /> },
   { label: "TEAM", value: player.team.full_name, icon: null },
 ].map((s, i) => (
   <div key={i} className="glass p-6 rounded-2xl text-center">
     {s.icon}
     <p className="text-gray-400 text-sm mt-2">{s.label}</p>
     <p className="text-3xl font-bold text-neon mt-1">{s.value}</p>
   </div>
 ))}
              </div>
            )}
          </div>
        </section>

        {/* Live Games Grid */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-20">
          {/* Live Games */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6 text-neon flex items-center gap-3"><Calendar className="w-8 h-8" /> Live / Today</h2>
            {games?.data?.slice(0,8).map((g: any) => (
              <div key={g.id} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <p className="font-bold">{g.home_team.full_name}</p>
                    <p className="text-3xl font-bold text-neon">{g.home_team_score}</p>
                  </div>
                  <span className="mx-4 text-gray-500">vs</span>
                  <div>
                    <p className="font-bold">{g.visitor_team.full_name}</p>
                    <p className="text-3xl font-bold text-neon">{g.visitor_team_score}</p>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">{g.status}</p>
              </div>
            ))}
          </div>

          {/* Standings */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6 text-purple flex items-center gap-3"><Trophy className="w-8 h-8" /> Standings</h2>
            {standings?.children?.[0]?.standings?.entries?.slice(0,8).map((t: any, i: number) => (
              <div key={i} className="flex justify-between py-2">
                <span>{i+1}. {t.team.displayName}</span>
                <span className="text-neon font-bold">{t.stats.find((s: any) => s.type === 'wins')?.displayValue}-{t.stats.find((s: any) => s.type === 'losses')?.displayValue}</span>
              </div>
            ))}
          </div>

          {/* News */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6 text-pink flex items-center gap-3"><Newspaper className="w-8 h-8" /> Latest News</h2>
            {news?.articles?.slice(0,6).map((a: any) => (
              <a key={a.links.api.news.href} href={a.links.web.href} target="_blank" className="block mb-4 hover:text-neon transition">
                <p className="font-medium line-clamp-2">{a.headlines[0]?.description || a.title}</p>
                <p className="text-xs text-gray-400">{format(new Date(a.published), 'MMM d, h:mm a')}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
