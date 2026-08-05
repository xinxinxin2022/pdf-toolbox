export default function Hero3D() {
  return (
    <div className="relative w-full h-full perspective-container overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-blue-400 dark:from-primary-900 dark:via-primary-800 dark:to-blue-900" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating PDF cards */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Card 1 */}
        <div className="pdf-card-3d absolute" style={{ left: '15%', top: '30%' }}>
          <div className="w-32 h-40 md:w-40 md:h-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 transform rotate-[-12deg]">
            <div className="w-full h-3 bg-red-400 rounded mb-2" />
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Card 2 - Center, main */}
        <div className="pdf-card-3d-slow absolute z-10" style={{ top: '20%' }}>
          <div className="w-40 h-52 md:w-48 md:h-60 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5">
            <div className="w-full h-4 bg-blue-500 rounded mb-3" />
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="pdf-card-3d-delayed absolute" style={{ right: '15%', top: '35%' }}>
          <div className="w-32 h-40 md:w-40 md:h-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 transform rotate-[12deg]">
            <div className="w-full h-3 bg-green-400 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
