import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Upload, Trash2, Copy, Check, Search, AlertCircle, FileText, File } from 'lucide-react';

interface MediaItem {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeUploading, setResumeUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const json = await res.json();
        setMedia(json);
      }
    } catch (err) {
      console.error('Error loading media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        setResumeUrl(json.resumeUrl || '');
      }
    } catch (err) {
      console.error('Error loading resume link:', err);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchResume();
  }, []);

  const handleResumeUpload = async (file: File) => {
    setResumeUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setResumeUrl(json.resumeUrl || '');
      } else {
        const errJson = await res.json();
        setError(errJson.error || 'Failed to upload resume document.');
      }
    } catch (err) {
      setError('Connection refused during resume upload.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await fetchMedia();
      } else {
        const errJson = await res.json();
        setError(errJson.error || 'Failed to upload file.');
      }
    } catch (err) {
      setError('Connection refused during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUploadFile(e.target.files[0]);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const res = await fetch(`/api/admin/media/${filename}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((item) => item.filename !== filename));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (url: string, filename: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedFilename(filename);
    setTimeout(() => setCopiedFilename(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-[#1A1A1A] pb-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Image className="h-5 w-5 text-emerald-500" />
          <span>Interactive Media Library</span>
        </h2>
        <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
          Upload, manage, copy static links, and delete assets for rich-content portfolio cards.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Résumé Document Manager */}
      <div className="p-5 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-3 rounded-xl bg-[#111] border border-[#1A1A1A] text-emerald-400 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Résumé Document</h3>
            <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline break-all"
                >
                  {resumeUrl}
                </a>
              ) : (
                'No résumé uploaded yet. A "Download Résumé" button appears on the About and Contact pages once uploaded.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {resumeUrl && (
            <button
              onClick={() => copyUrl(resumeUrl, 'resume')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#111] hover:bg-neutral-900 text-[#A1A1AA] hover:text-white border border-[#1A1A1A] rounded text-[10px] uppercase font-bold tracking-wider transition cursor-pointer"
            >
              {copiedFilename === 'resume' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedFilename === 'resume' ? 'Copied' : 'Copy Link'}</span>
            </button>
          )}
          <input
            type="file"
            ref={resumeInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleResumeUpload(e.target.files[0]);
            }}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <button
            onClick={() => resumeInputRef.current?.click()}
            disabled={resumeUploading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-100 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3 w-3" />
            <span>{resumeUploading ? 'Uploading...' : resumeUrl ? 'Replace Résumé' : 'Upload Résumé'}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer bg-[#0A0A0A] ${
          dragActive
            ? 'border-emerald-500 bg-emerald-950/10'
            : 'border-[#1A1A1A] hover:border-[#222]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />

        <div className="h-12 w-12 rounded-xl bg-[#111] border border-[#1A1A1A] flex items-center justify-center text-zinc-400">
          {uploading ? (
            <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Upload className="h-5 w-5 text-emerald-400" />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-white font-bold">
            {uploading ? 'Synching file metadata...' : 'Drag & Drop files here, or click to browse'}
          </p>
          <p className="text-[10px] text-[#71717A] uppercase font-mono tracking-wider">
            Supports PNG, JPEG, SVG, WebP, and PDF (Max 10MB)
          </p>
        </div>
      </div>

      {/* Media Search & Grid Previews */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#52525B]">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {loading ? (
          <div className="flex gap-4 p-8">
            <div className="animate-pulse bg-[#111] h-32 w-full rounded-xl" />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center p-12 border border-[#1A1A1A] rounded-xl bg-[#0A0A0A]/30">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">Grid Empty</span>
            <p className="text-xs text-zinc-500">No matching media assets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => {
              const isImage = item.mimeType?.startsWith('image/');
              return (
                <div
                  key={item.filename}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3 flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="aspect-square bg-[#111] rounded-lg overflow-hidden flex items-center justify-center border border-[#1A1A1A] relative">
                    {isImage ? (
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : item.mimeType === 'application/pdf' ? (
                      <FileText className="h-8 w-8 text-emerald-400" />
                    ) : (
                      <File className="h-8 w-8 text-zinc-500" />
                    )}

                    {/* Quick action overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyUrl(item.url, item.filename)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-white transition cursor-pointer"
                        title="Copy direct URL"
                      >
                        {copiedFilename === item.filename ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.filename)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] text-white font-bold truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[9px] font-mono text-[#71717A] uppercase">
                      {formatSize(item.size)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
