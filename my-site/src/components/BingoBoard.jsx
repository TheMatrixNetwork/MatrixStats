import React from 'react';

function GameIcon({ game, className }) {
  const [ext, setExt] = React.useState('svg');
  if (!game) return null;
  const src = `/icons/${game.toLowerCase()}.${ext}`;
  return (
    <img
      src={src}
      alt={game + ' icon'}
      className={className}
      onError={() => {
        if (ext === 'svg') {
          setExt('png');
        }
      }}
    />
  );
}

export default function BingoBoard({ API_BASE, username }) {
  const [cells, setCells] = React.useState([]);
  const [hidden, setHidden] = React.useState(false);
  const [revealDate, setRevealDate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [active, setActive] = React.useState(null); // cell object
  const [updating, setUpdating] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  // Close overlay with ESC
  React.useEffect(() => {
    if (!expanded) return;
    function onKey(e) { if (e.key === 'Escape') { setExpanded(false); setActive(null); } }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const load = React.useCallback(async () => {
    if (!username) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/bingo?username=${encodeURIComponent(username)}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCells(data.board.cells || []);
        setHidden(!!data.board.hidden);
        setRevealDate(data.board.revealDate || null);
      } else {
        setError(data.message || 'Failed to load board');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, username]);

  React.useEffect(() => { load(); }, [load]);

  async function updateCell(partial) {
  if (!username || active == null) return;
  if (hidden) return; // block client-side when hidden
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/bingo/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, cellIndex: active.index, ...partial })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCells(data.board.cells || []);
        setHidden(!!data.board.hidden);
        setRevealDate(data.board.revealDate || null);
        // refresh active reference
        const updated = data.board.cells.find(c => c.index === active.index);
        setActive(updated || null);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Bingo Board</h3>
        <button onClick={load} disabled={loading} className="text-xs px-2 py-1 rounded border bg-white dark:bg-gray-800 dark:border-gray-700">
          {loading ? '…' : 'Refresh'}
        </button>
  <button onClick={() => setExpanded(true)} type="button" aria-haspopup="dialog" aria-expanded={expanded} className="ml-2 text-xs px-2 py-1 rounded border bg-white dark:bg-gray-800 dark:border-gray-700">Expand</button>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {/* Column headers (compact view) */}
      <div className="grid grid-cols-5 gap-1 select-none">
        {['L','E','F','T','S'].map(l => (
          <div key={l} className="text-[10px] sm:text-xs font-semibold tracking-wider text-center text-gray-500 dark:text-gray-400 pb-0.5">{l}</div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {cells.map(cell => {
          return (
            <button
              key={cell.index}
              onClick={() => !hidden && setActive(cell)}
              className={`aspect-square relative flex items-center justify-center p-0 rounded border overflow-hidden text-center transition group
                ${hidden ? 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 cursor-not-allowed' : (cell.completed ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 dark:bg-gray-900 dark:border-gray-700')}
              `}
              title={hidden ? 'Hidden until reveal' : cell.title}
              disabled={hidden}
            >
              {/* (Player count removed in compact view) */}
              {hidden ? (
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">??</span>
              ) : cell.free ? (
                <span className="text-[10px] font-medium px-1 break-words leading-tight">{cell.title}</span>
              ) : cell.game ? (
                <GameIcon
                  game={cell.game}
                  className={`w-10 h-10 object-contain opacity-90 transition group-hover:scale-110 ${cell.completed ? 'invert' : ''}`}
                />
              ) : (
                <span className="text-[10px] font-medium px-1 break-words leading-tight">{cell.title}</span>
              )}
              {!hidden && cell.score && !cell.completed && (
                <span className="absolute bottom-0 right-0 text-[9px] px-1 bg-black/50 text-white">{cell.score}</span>
              )}
              {!hidden && cell.completed && (
                <span className="absolute bottom-0 right-0 text-[9px] px-1 bg-white/20">✔</span>
              )}
            </button>
          );
        })}
      </div>

  {!expanded && active && !hidden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg dark:text-gray-100">{active.free ? active.title : active.title}</h4>
                {!active.free && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {active.game && <span className="mr-2">Game: {active.game}</span>}
                    {active.players != null && <span className="mr-2">Players: {active.players}</span>}
                    {active.pack && (
                      <span>
                        Pack: {active.pack}
                        {active.level != null && ` (${active.level})`}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button onClick={() => setActive(null)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm">✕</button>
            </div>
            {!active.free && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Score</label>
                  <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1 text-xs dark:bg-gray-900 dark:border-gray-700"
                    value={active.score || ''}
                    maxLength={32}
                    onChange={e => setActive({ ...active, score: e.target.value })}
                    disabled={updating}
                  />
                  <button
                    onClick={() => updateCell({ score: active.score || '' })}
                    disabled={updating}
                    className="text-xs px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                  >Save</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Completed</span>
                  <button
                    onClick={() => updateCell({ completed: !active.completed })}
                    disabled={updating}
                    className={`text-xs px-3 py-1 rounded border ${active.completed ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 dark:bg-gray-900 dark:border-gray-700'}`}
                  >{active.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                </div>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <button onClick={() => setActive(null)} className="text-xs px-3 py-1 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-black/70 backdrop-blur-sm" role="dialog" aria-label="Expanded bingo board" aria-modal="true">
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
              onClick={() => { setExpanded(false); setActive(null); }}
              className="px-3 py-1 rounded bg-white/90 text-xs font-medium shadow hover:bg-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              aria-label="Close bingo board"
            >Close ✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-5 gap-2 mb-3 select-none">
                {['L','E','F','T','S'].map(l => (
                  <div
                    key={l}
                    className="text-lg md:text-2xl font-extrabold tracking-widest text-center text-white/90 dark:text-white drop-shadow-sm"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {cells.map(cell => {
                  const completed = cell.completed;
                  const showPlayers = !cell.free && cell.players != null && cell.players > 0;
                  return (
                    <button
                      key={cell.index}
                      onClick={() => !hidden && setActive(cell)}
                      className={`relative rounded-lg h-40 flex items-center justify-center text-center font-medium leading-tight transition overflow-hidden group focus:outline-none
                        ${hidden ? 'bg-gray-500/60 border border-gray-400 dark:border-gray-600 cursor-not-allowed' : (completed ? 'bg-green-600 border border-green-400 shadow-lg shadow-green-800/30 ring-2 ring-green-300/40' : 'border border-gray-300 dark:border-gray-700 bg-gray-800/30')}
                      `}
                      title={hidden ? 'Hidden until reveal' : cell.title}
                      disabled={hidden}
                    >
                      {!hidden && cell.game && !cell.free && (
                        <GameIcon
                          game={cell.game}
                          className={`absolute inset-0 w-full h-full object-cover transition ${completed ? 'opacity-10 saturate-0' : 'opacity-65 group-hover:opacity-35'}`}
                        />
                      )}
                      {!hidden && !completed && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/30 pointer-events-none" />
                      )}
                      {!hidden && showPlayers && (
                        <div className="absolute top-1 left-1 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium bg-black/55 backdrop-blur-sm text-white shadow-sm">
                          <span>{cell.players}</span>
                          <span className="font-semibold">x</span>
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" aria-hidden="true">
                            <circle cx="12" cy="7" r="4" />
                            <path d="M4 20c0-4 3-7 8-7s8 3 8 7v1H4v-1Z" />
                          </svg>
                          <span className="sr-only">{cell.players} player{cell.players === 1 ? '' : 's'}</span>
                        </div>
                      )}
                      <span className={`relative z-10 px-2 break-words text-sm md:text-base ${hidden ? 'text-gray-200 font-semibold' : (completed ? 'text-white font-semibold drop-shadow-sm' : 'text-white drop-shadow')} ${cell.free && !hidden ? 'text-black dark:text-white drop-shadow-none' : ''}`}>
                        {hidden ? '??' : cell.title}
                      </span>
                      {!hidden && cell.score && !completed && (
                        <span className="absolute bottom-1 right-1 text-[10px] md:text-[11px] px-1 bg-black/60 text-white rounded z-10">{cell.score}</span>
                      )}
                      {!hidden && completed && (
                        <span className="absolute bottom-1 right-1 text-[10px] md:text-[11px] px-1 bg-white/90 text-green-700 rounded z-10 font-semibold">✔</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l dark:border-gray-700 p-4 flex flex-col gap-4 overflow-auto">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-600 dark:text-gray-300">Details</h4>
            {hidden ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">Board is hidden until {revealDate ? new Date(revealDate).toLocaleString() : 'reveal'}.</p>
            ) : active ? (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-base dark:text-gray-100 break-words">{active.title}</p>
                  {!active.free && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                      {active.game && <span>Game: {active.game}</span>}
                      {active.players != null && <span>Players: {active.players}</span>}
                      {active.pack && (
                        <span>
                          Pa1ck1: {active.pack}
                          {active.level != null && ` (${active.level})`}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                {!active.free && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12">Score</label>
                      <input
                        type="text"
                        className="flex-1 border rounded px-2 py-1 text-xs dark:bg-gray-900 dark:border-gray-700"
                        value={active.score || ''}
                        maxLength={32}
                        onChange={e => setActive({ ...active, score: e.target.value })}
                        disabled={updating}
                      />
                      <button
                        onClick={() => updateCell({ score: active.score || '' })}
                        disabled={updating}
                        className="text-xs px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                      >Save</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-300">Completed</span>
                      <button
                        onClick={() => updateCell({ completed: !active.completed })}
                        disabled={updating}
                        className={`text-xs px-3 py-1 rounded border ${active.completed ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 dark:bg-gray-900 dark:border-gray-700'}`}
                      >{active.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                    </div>
                  </>
                )}
                {!active && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Select a cell to view/edit details.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Select a cell to view/edit details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
