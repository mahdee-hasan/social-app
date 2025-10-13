import { useEffect, useRef } from "react";
import { User as UserIcon, Hash } from "lucide-react";

export function AutocompleteMenu({
  type,
  items,
  position,
  selectedIndex,
  onSelect,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const selected = menuRef.current?.querySelector('[data-selected="true"]');
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (items.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxHeight: "300px",
        width: "280px",
      }}
    >
      <div className="overflow-y-auto max-h-[300px]">
        {type === "mention"
          ? items.map((user, index) => (
              <button
                key={user._id}
                data-selected={index === selectedIndex}
                onClick={() => onSelect(user)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 rounded-full" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    @{user.email || user.name.toLowerCase().replace(/\s+/g, "")}
                  </div>
                </div>
                {index === selectedIndex && (
                  <UserIcon className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
            ))
          : items.map((hashtag, index) => (
              <button
                key={hashtag.value}
                data-selected={index === selectedIndex}
                onClick={() => onSelect(hashtag)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === selectedIndex ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Hash className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">#{hashtag.value}</div>
                  <div className="text-xs text-gray-500">
                    {hashtag.used.toLocaleString()} uses
                  </div>
                </div>
                {index === selectedIndex && (
                  <Hash className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
            ))}
      </div>
    </div>
  );
}
