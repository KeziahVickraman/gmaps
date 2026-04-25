/**
 * SavePlaceSheet — bottom sheet: "Add to list" picker + inline new list creation.
 * No modal, no page navigation — inline text input inside sheet.
 * Cluster 3: SavedView.
 */
import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import BottomSheet from '../shared/BottomSheet'
import { useUser } from '../../context/UserContext'

export default function SavePlaceSheet({ open, onClose, place }) {
  const { savedLists, savePlaceToList, createList, isPlaceSaved } = useUser()
  const [newListName, setNewListName] = useState('')
  const [creatingNew, setCreatingNew] = useState(false)

  const handleSaveToList = (listId) => {
    savePlaceToList(place.id, listId)
    onClose()
  }

  const handleCreateAndSave = () => {
    if (!newListName.trim()) return
    createList(newListName.trim(), place.id)
    setNewListName('')
    setCreatingNew(false)
    onClose()
  }

  if (!place) return null

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={`Save "${place.name}"`}
      initialSnap={0.55}
      aria-label={`Save ${place.name} to a list`}
    >
      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Existing lists */}
        {savedLists.length > 0 && (
          <>
            <p className="label-text text-text-muted">Add to existing list</p>
            <div className="flex flex-col gap-2">
              {savedLists.map((list) => {
                const alreadySaved = list.placeIds.includes(place.id)
                return (
                  <button
                    key={list.id}
                    onClick={() => !alreadySaved && handleSaveToList(list.id)}
                    disabled={alreadySaved}
                    className={`flex items-center justify-between p-3 card transition-state ${
                      alreadySaved
                        ? 'opacity-50 cursor-default'
                        : 'hover:border-primary hover:shadow-card cursor-pointer'
                    }`}
                    style={{ minHeight: '52px' }}
                    aria-label={alreadySaved ? `${list.name} — already saved` : `Add to ${list.name}`}
                  >
                    <div>
                      <p className="font-dm font-medium text-sm text-text-primary">{list.name}</p>
                      <p className="text-xs text-text-muted">{list.placeIds.length} places</p>
                    </div>
                    {alreadySaved && (
                      <Check size={16} className="text-primary" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Create new list — inline, no modal */}
        <div className="border-t border-border pt-3">
          {!creatingNew ? (
            <button
              onClick={() => setCreatingNew(true)}
              className="flex items-center gap-2 text-primary text-sm font-dm font-medium hover:underline"
              style={{ minHeight: '44px' }}
            >
              <Plus size={16} aria-hidden="true" />
              Create new list
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name…"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAndSave()}
                aria-label="New list name"
                className="flex-1 px-3 py-2 border border-border rounded-btn text-sm font-dm focus:outline-none focus:border-primary transition-state"
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={handleCreateAndSave}
                disabled={!newListName.trim()}
                className="btn-primary text-sm px-4 disabled:opacity-50"
                aria-label="Save new list"
              >
                Save
              </button>
              <button
                onClick={() => { setCreatingNew(false); setNewListName('') }}
                className="btn-secondary text-sm px-3"
                aria-label="Cancel new list"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  )
}
