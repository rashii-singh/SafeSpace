import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Heart,
  Sparkles,
} from 'lucide-react';

// Helper to persist contacts in localStorage
const STORAGE_KEY = 'sos_contacts';

export default function SOSCircle() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  // Load contacts on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  // Save contacts whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const openForm = (contact = null) => {
    if (contact) {
      setEditingId(contact.id);
      setFormData({ name: contact.name, phone: contact.phone });
    } else {
      setEditingId(null);
      setFormData({ name: '', phone: '' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({ name: '', phone: '' });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    if (!trimmedName || !trimmedPhone) return;
    if (editingId !== null) {
      // Edit existing
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, name: trimmedName, phone: trimmedPhone } : c
        )
      );
    } else {
      // Add new
      const newContact = {
        id: Date.now(),
        name: trimmedName,
        phone: trimmedPhone,
        priority: contacts.length + 1,
      };
      setContacts((prev) => [...prev, newContact]);
    }
    closeForm();
  };

  const deleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const moveContact = (id, direction) => {
    setContacts((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const newArr = [...prev];
      const [moved] = newArr.splice(idx, 1);
      newArr.splice(newIdx, 0, moved);
      // Re‑assign priority based on new order
      return newArr.map((c, i) => ({ ...c, priority: i + 1 }));
    });
  };

  // Emergency suggestion – pick the highest‑priority contact
  const topContact = contacts.reduce((best, cur) => {
    if (!best || cur.priority < best.priority) return cur;
    return best;
  }, null);

  const suggestions = [
    topContact ? `You may feel better talking to ${topContact.name} right now.` : null,
    topContact ? `Consider reaching out to ${topContact.name}.` : null,
    'A deep breath can help. If you need to talk, a trusted friend is just a call away.',
    'Sometimes a short walk can clear the mind. You deserve a moment of calm.',
  ].filter(Boolean);

  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return (
    <motion.div
      className="min-h-screen bg-cream p-6 md:p-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        <ShieldCheck className="inline w-8 h-8 mr-2 align-middle text-sage" />
        Emotional SOS Circle
      </h1>

      {/* Emergency suggestion card */}
      <motion.div
        className="mb-8 p-5 bg-sage/5 border border-sage/20 rounded-2xl text-sage"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Sparkles className="w-5 h-5 mr-2 inline-block" />
        <span className="font-medium">{randomSuggestion}</span>
      </motion.div>

      {/* Contacts list */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-sage flex items-center">
            <Heart className="w-5 h-5 mr-2" /> Trusted Contacts
          </h2>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-1 px-4 py-2 bg-sage text-white rounded-full hover:bg-sage/90 transition"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center">No contacts yet. Add someone you trust.</p>
        ) : (
          <AnimatePresence>
            {contacts.map((contact, idx) => (
              <motion.div
                key={contact.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-4 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    title="Call"
                    className="p-1 text-sage hover:text-sage-600"
                    onClick={() => window.open(`tel:${contact.phone}`)}
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    title="Message"
                    className="p-1 text-sage hover:text-sage-600"
                    onClick={() => window.open(`sms:${contact.phone}`)}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button
                    title="Edit"
                    className="p-1 text-gray-600 hover:text-gray-800"
                    onClick={() => openForm(contact)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    className="p-1 text-rose-500 hover:text-rose-600"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    title="Move up"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => moveContact(contact.id, 'up')}
                    disabled={idx === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    title="Move down"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => moveContact(contact.id, 'down')}
                    disabled={idx === contacts.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </section>

      {/* Add / Edit Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sage text-white rounded-full hover:bg-sage/90 transition"
              >
                {editingId ? 'Save Changes' : 'Add Contact'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </motion.div>
  );
}

