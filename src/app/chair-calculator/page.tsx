'use client';

import { useState, useEffect } from 'react';

export default function ChairCalculator() {
  const [inputs, setInputs] = useState({
    B: 54,
    WB: 25,
    H: 39,
    D: 30,
    F2A: 26,
    BR: 4,
    FC: 6,
    hem: 0.5,
    AT2F_manual: 32.7
  });
  
  const [roundMode, setRoundMode] = useState(true);
  const [mode, setMode] = useState('auto');
  const [results, setResults] = useState({
    AT2F: 0,
    ML: 0,
    MD: 0,
    fits: true,
    addLength: 0,
    totalLen: 0
  });

  useEffect(() => {
    // Run calculation on mount and when inputs change
    compute();
  }, [inputs, roundMode, mode]);

  const parseNum = (value: number) => {
    return isFinite(value) ? value : 0;
  };

  const fmtExact = (v: number) => isFinite(v) ? (Math.round(v * 100) / 100).toFixed(2) : "–";
  const fmtInch = (v: number, r: boolean) => r ? Math.ceil(v).toString() : fmtExact(v);
  const fmtYards = (v: number, r: boolean) => {
    let y = v / 36;
    return r ? Math.ceil(y).toString() : fmtExact(y);
  };

  const compute = () => {
    const B = parseNum(inputs.B);
    const WB = parseNum(inputs.WB);
    const H = parseNum(inputs.H);
    const D = parseNum(inputs.D);
    const F2A = parseNum(inputs.F2A);
    const BR = parseNum(inputs.BR);
    const FC = parseNum(inputs.FC);
    const hem = parseNum(inputs.hem);
    const AT2F_manual = parseNum(inputs.AT2F_manual);

    const AT2F = mode === 'manual' ? AT2F_manual : Math.sqrt(Math.max(0, H - F2A) ** 2 + Math.max(0, D) ** 2);
    const ML = (H + BR + AT2F + F2A) - 2 * FC;
    const MD = (WB + 2 * H) - 2 * FC;
    const addLength = F2A + AT2F + BR - FC + hem;
    const fits = MD <= B;
    const totalLen = ML + addLength;

    setResults({
      AT2F,
      ML,
      MD,
      fits,
      addLength,
      totalLen
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const resetDefaults = () => {
    setInputs({
      B: 54,
      WB: 25,
      H: 39,
      D: 30,
      F2A: 26,
      BR: 4,
      FC: 6,
      hem: 0.5,
      AT2F_manual: 32.7
    });
    setMode('auto');
    setRoundMode(true);
  };

  const renderDiagram = () => {
    if (!results.ML || !results.MD) return null;

    const B = inputs.B;
    const MD = results.MD;
    const ML = results.ML;
    const addLength = results.addLength;
    const totalLen = ML + addLength;
    const centerW = Math.min(B, MD);
    const sideW = Math.max(0, (MD - B) / 2);
    
    const W = 900;
    const H = 420;
    const pad = 28;
    const scale = Math.min((W - pad * 2) / MD, (H - pad * 2) / totalLen) || 1;
    const sx = pad;
    const sy = pad;
    const rectX = sx + sideW * scale;
    const rectY = sy;
    const rectW = centerW * scale;
    const rectH = totalLen * scale;

    return (
      <>
        {/* Outer guide rectangle */}
        <rect
          x={sx}
          y={sy}
          width={MD * scale}
          height={rectH}
          fill="none"
          stroke="#94a3b8"
          strokeDasharray="6,6"
        />
        
        {/* Side panels if needed */}
        {sideW > 0 && (
          <>
            <rect
              x={sx}
              y={rectY}
              width={sideW * scale}
              height={rectH}
              fill="#22c55e33"
              stroke="#16a34a66"
            />
            <rect
              x={sx + sideW * scale + rectW}
              y={rectY}
              width={sideW * scale}
              height={rectH}
              fill="#22c55e33"
              stroke="#16a34a66"
            />
          </>
        )}
        
        {/* Center panel */}
        <rect
          x={rectX}
          y={rectY}
          width={rectW}
          height={rectH}
          fill="#eef2ff"
          stroke="#0f172a22"
        />
        
        {/* Dimension lines */}
        <line
          x1={sx}
          y1={sy - 10}
          x2={sx + MD * scale}
          y2={sy - 10}
          stroke="#334155"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <text
          x={sx + (MD * scale) / 2}
          y={sy - 14}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
        >
          Width (MD): {MD.toFixed(1)} in
        </text>
        
        <line
          x1={rectX}
          y1={rectY + rectH + 14}
          x2={rectX + rectW}
          y2={rectY + rectH + 14}
          stroke="#334155"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <text
          x={rectX + rectW / 2}
          y={rectY + rectH + 28}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
        >
          Bolt width used: {centerW.toFixed(1)} in
        </text>
        
        <line
          x1={sx - 12}
          y1={sy}
          x2={sx - 12}
          y2={sy + rectH}
          stroke="#334155"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <text
          x={sx - 16}
          y={sy + rectH / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={12}
          fill="#334155"
          transform={`rotate(-90 ${sx - 16} ${sy + rectH / 2})`}
        >
          Length: {totalLen.toFixed(1)} in
        </text>
        
        {sideW > 0 && (
          <text
            x={sx + 6}
            y={sy + 14}
            fontSize={12}
            fill="#166534"
          >
            Each side panel: {sideW.toFixed(1)} in × {totalLen.toFixed(1)} in
          </text>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chair Cover Calculator — With Cut Diagram</h1>
        
        <div className="flex items-center gap-4 flex-wrap mb-4">
          <span className="px-3 py-1.5 rounded-full border border-gray-300 bg-blue-50 text-xs">Units: inches</span>
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={roundMode}
              onChange={(e) => setRoundMode(e.target.checked)}
            />
            <span>Round to nearest inch / ceil yards</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="radio" 
              name="mode" 
              value="auto" 
              checked={mode === 'auto'}
              onChange={(e) => setMode(e.target.value)}
            />
            <span>AT2F Auto</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="radio" 
              name="mode" 
              value="manual"
              checked={mode === 'manual'}
              onChange={(e) => setMode(e.target.value)}
            />
            <span>AT2F Manual</span>
          </label>
          
          <button 
            onClick={compute}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            Recalculate
          </button>
          
          <button 
            onClick={resetDefaults}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            Reset to defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="font-semibold mb-2">Inputs</div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries({
                B: 'B (bolt width)',
                WB: 'WB (back width)',
                H: 'H (height)',
                D: 'D (depth)',
                F2A: 'F2A (floor → armrest)',
                BR: 'BR (backrest thickness)',
                FC: 'FC (floor clearance)',
                hem: 'Hem allowance',
                AT2F_manual: 'AT2F (manual)'
              }).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-xs text-gray-600">{label}</span>
                  <input
                    type="number"
                    value={inputs[key as keyof typeof inputs]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    step="0.01"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    disabled={key === 'AT2F_manual' && mode === 'auto'}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="font-semibold mb-2">Results</div>
            <div className="space-y-3">
              <div className="py-2 border-b border-dashed border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm">AT2F used</span>
                  <strong className="text-sm">{fmtInch(results.AT2F, roundMode)} in</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {mode === 'manual' ? `Manual: ${inputs.AT2F_manual}` : `√[(${inputs.H} - ${inputs.F2A})² + ${inputs.D}²] = √[${inputs.H - inputs.F2A}² + ${inputs.D}²] = ${fmtExact(results.AT2F)}`}
                </div>
              </div>
              <div className="py-2 border-b border-dashed border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm">Main length (ML)</span>
                  <strong className="text-sm">{fmtInch(results.ML, roundMode)} in ({fmtYards(results.ML, roundMode)} yd)</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({inputs.H} + {inputs.BR} + {fmtExact(results.AT2F)} + {inputs.F2A}) - 2×{inputs.FC} = {fmtExact(results.ML)}
                </div>
              </div>
              <div className="py-2 border-b border-dashed border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm">Main width (MD)</span>
                  <strong className="text-sm">{fmtInch(results.MD, roundMode)} in</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({inputs.WB} + 2×{inputs.H}) - 2×{inputs.FC} = {fmtExact(results.MD)}
                </div>
              </div>
              <div className="py-2 border-b border-dashed border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm">Fits bolt width?</span>
                  <strong className="text-sm">{results.fits ? 'Yes' : 'No'}</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  MD ({fmtExact(results.MD)}) {results.fits ? '≤' : '>'} B ({inputs.B})
                </div>
              </div>
              <div className="py-2 border-b border-dashed border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm">{results.fits ? 'Linear yardage' : 'Addl width (MD−B)'}</span>
                  <strong className="text-sm">{results.fits ? `${fmtYards(results.ML, roundMode)} yd` : `${fmtInch(results.MD - inputs.B, roundMode)} in`}</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {results.fits ? `ML ÷ 36 = ${fmtExact(results.ML)} ÷ 36 = ${fmtExact(results.ML / 36)}` : `${fmtExact(results.MD)} - ${inputs.B} = ${fmtExact(results.MD - inputs.B)}`}
                </div>
              </div>
              <div className="py-2">
                <div className="flex justify-between">
                  <span className="text-sm">Addl length (AL)</span>
                  <strong className="text-sm">{fmtInch(results.addLength, roundMode)} in</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {inputs.F2A} + {fmtExact(results.AT2F)} + {inputs.BR} - {inputs.FC} + {inputs.hem} = {fmtExact(results.addLength)}
                </div>
              </div>
            </div>
            
            <div className="font-semibold mt-4 mb-2">Material to Buy</div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-dashed border-gray-200">
                <span className="text-sm">Total length</span>
                <strong className="text-sm">{fmtInch(results.totalLen, roundMode)} in</strong>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm">Yards to buy</span>
                <strong className="text-sm">{fmtYards(results.totalLen, roundMode)} yd</strong>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Rounded mode rounds up inches to nearest integer and yards to next integer.
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mt-4">
          <div className="font-semibold mb-2">Cut Diagram (to scale)</div>
          <div className="flex flex-col gap-3">
            <svg 
              viewBox="0 0 900 420" 
              className="w-full h-96 border border-dashed border-gray-300 rounded-xl bg-blue-50/20"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Defs for arrow markers */}
              <defs>
                <marker
                  id="arrow"
                  markerWidth={8}
                  markerHeight={8}
                  refX={4}
                  refY={4}
                  orient="auto"
                  viewBox="0 0 8 8"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
                </marker>
              </defs>
              
              {renderDiagram()}
            </svg>
            <div className="flex gap-4 items-center text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-indigo-100 border border-gray-800/20"></span>
                Center panel
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500/20 border border-green-600/40"></span>
                Optional side panels
              </span>
              <span className="ml-auto">All dimensions are cut sizes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}