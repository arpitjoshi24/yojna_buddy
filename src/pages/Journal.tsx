import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Search, 
  Tag, 
  Trash, 
  Edit, 
  Smile,
  SmilePlus,
  Frown,
  Meh,
  Heart,
  XCircle,
  X
} from 'lucide-react';
import { Journal } from '../types';
import { toast } from 'sonner';

const JournalPage = () => {
  const { journals, addJournal, updateJournal, deleteJournal, loading } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [journalToEdit, setJournalToEdit] = useState<Journal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique tags from journals
    const tags: string[] = [];
    journals.forEach(journal => {
      journal.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    setAllTags(tags.sort());
  }, [journals]);

  useEffect(() => {
    let filtered = [...journals];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(journal => 
        journal.title.toLowerCase().includes(term) || 
        journal.content.toLowerCase().includes(term) ||
        journal.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(journal => 
        journal.tags.includes(selectedTag)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setFilteredJournals(filtered);
  }, [journals, searchTerm, selectedTag]);

  const handleDeleteJournal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteJournal(id);
        toast.success('Journal entry deleted successfully');
      } catch (error) {
        console.error('Error deleting journal entry:', error);
        toast.error('Failed to delete journal entry');
      }
    }
  };

  const handleEditJournal = (journal: Journal) => {
    setJournalToEdit(journal);
    setShowAddModal(true);
  };

  const getMoodIcon = (mood: Journal['mood'] | undefined) => {
    switch (mood) {
      case 'great':
        return <Heart size={16} className="text-pink-500" />;
      case 'good':
        return <Smile size={16} className="text-green-500" />;
      case 'neutral':
        return <Meh size={16} className="text-blue-500" />;
      case 'bad':
        return <Frown size={16} className="text-amber-500" />;
      case 'terrible':
        return <Frown size={16} className="text-red-500" />;
      default:
        return <Smile size={16} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Journal</h1>
          <p className="text-gray-600">Capture your thoughts, reflections, and memories</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => {
              setJournalToEdit(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            New Journal Entry
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with tags */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-700 mb-3">Search</h3>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search journals..."
                className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <XCircle size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <h3 className="font-medium text-gray-700 mb-3">Tags</h3>
            <div className="space-y-2">
              <button
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  !selectedTag 
                    ? 'bg-purple-100 text-purple-800 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedTag(null)}
              >
                <Tag size={16} className="mr-2" />
                All Entries
              </button>
              
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                    selectedTag === tag 
                      ? 'bg-purple-100 text-purple-800 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                >
                  <Tag size={16} className="mr-2" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow">
          {filteredJournals.length > 0 ? (
            <div className="space-y-4">
              {filteredJournals.map(journal => (
                <div key={journal.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{journal.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditJournal(journal)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteJournal(journal.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar size={16} className="mr-2" />
                      {format(new Date(journal.date), 'EEEE, MMMM d, yyyy')}
                      {journal.mood && (
                        <span className="flex items-center ml-4">
                          {getMoodIcon(journal.mood)}
                          <span className="ml-1 capitalize">{journal.mood}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="prose max-w-none text-gray-700 mb-4 whitespace-pre-line">
                      {journal.content}
                    </div>
                    
                    {journal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {journal.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                          >
                            <Tag size={12} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No journal entries found</h3>
              <p className="text-gray-500 mb-4">
                {journals.length === 0
                  ? "You haven't created any journal entries yet."
                  : "No entries match your search criteria."
                }
              </p>
              {journals.length === 0 && (
                <button 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Write your first entry
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <JournalModal
          journal={journalToEdit}
          onClose={() => {
            setShowAddModal(false);
            setJournalToEdit(null);
          }}
          onSave={async (journalData) => {
            try {
              if (journalToEdit) {
                await updateJournal(journalToEdit.id, journalData);
                toast.success('Journal entry updated successfully');
              } else {
                await addJournal(journalData as Omit<Journal, 'id'>);
                toast.success('Journal entry created successfully');
              }
              setShowAddModal(false);
              setJournalToEdit(null);
            } catch (error) {
              console.error('Error saving journal entry:', error);
              toast.error('Failed to save journal entry');
            }
          }}
          existingTags={allTags}
        />
      )}
    </div>
  );
};

interface JournalModalProps {
  journal: Journal | null;
  onClose: () => void;
  onSave: (journal: Partial<Journal>) => void;
  existingTags: string[];
}

const JournalModal: React.FC<JournalModalProps> = ({ journal, onClose, onSave, existingTags }) => {
  const [title, setTitle] = useState(journal?.title || '');
  const [content, setContent] = useState(journal?.content || '');
  const [date, setDate] = useState(journal?.date ? journal.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<Journal['mood']>(journal?.mood || undefined);
  const [tags, setTags] = useState<string[]>(journal?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  // Update tag suggestions based on input
  useEffect(() => {
    if (newTag.trim() === '') {
      setTagSuggestions([]);
      return;
    }

    const filteredTags = existingTags.filter(tag => 
      tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)
    );
    setTagSuggestions(filteredTags);
  }, [newTag, existingTags, tags]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const journalData: Partial<Journal> = {
      title,
      content,
      date: new Date(date).toISOString(),
      tags,
    };

    if (mood) {
      journalData.mood = mood;
    }

    onSave(journalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText size={18} className="mr-2 text-purple-600" />
            {journal ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="Give your entry a title..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mood
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={`px-3 py-2 rounded-md flex items-center ${
                  mood === 'great' 
                    ? 'bg-pink-100 text-pink-800 border-2 border-pink-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setMood(mood === 'great' ? undefined : 'great')}
              >
                <Heart size={18} className={mood === 'great' ? 'text-pink-500 mr-1' : 'text-gray-500 mr-1'} />
                Great
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md flex items-center ${
                  mood === 'good' 
                    ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setMood(mood === 'good' ? undefined : 'good')}
              >
                <Smile size={18} className={mood === 'good' ? 'text-green-500 mr-1' : 'text-gray-500 mr-1'} />
                Good
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md flex items-center ${
                  mood === 'neutral' 
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setMood(mood === 'neutral' ? undefined : 'neutral')}
              >
                <Meh size={18} className={mood === 'neutral' ? 'text-blue-500 mr-1' : 'text-gray-500 mr-1'} />
                Neutral
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md flex items-center ${
                  mood === 'bad' 
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setMood(mood === 'bad' ? undefined : 'bad')}
              >
                <Frown size={18} className={mood === 'bad' ? 'text-amber-500 mr-1' : 'text-gray-500 mr-1'} />
                Bad
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md flex items-center ${
                  mood === 'terrible' 
                    ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setMood(mood === 'terrible' ? undefined : 'terrible')}
              >
                <Frown size={18} className={mood === 'terrible' ? 'text-red-500 mr-1' : 'text-gray-500 mr-1'} />
                Terrible
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              required
              rows={10}
              placeholder="Write your thoughts here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex text-purple-500 hover:text-purple-700 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                placeholder="Add a tag..."
                className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                type="button"
                className="ml-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                onClick={handleAddTag}
              >
                <Plus size={16} />
              </button>
            </div>
            
            {tagSuggestions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {tagSuggestions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                    onClick={() => {
                      setTags([...tags, tag]);
                      setNewTag('');
                    }}
                  >
                    <Plus size={12} className="mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {journal ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalPage;