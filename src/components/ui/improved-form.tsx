"use client"

interface ImprovedColorPaletteProps {
  colors: string[]
  onColorSelect: (color: string) => void
  selectedColor?: string
}

export function ImprovedColorPalette({ colors, onColorSelect, selectedColor }: ImprovedColorPaletteProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Quick Colors:</span>
        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
      </div>
      <div className="grid grid-cols-8 gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`
              relative w-10 h-10 rounded-xl border-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95
              ${selectedColor === color 
                ? 'border-blue-500 ring-4 ring-blue-200 scale-110' 
                : 'border-white hover:border-gray-300'
              }
            `}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ImprovedFormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function ImprovedFormSection({ title, description, children, icon }: ImprovedFormSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-gray-800">{title}</label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="pl-0">
        {children}
      </div>
    </div>
  )
}
