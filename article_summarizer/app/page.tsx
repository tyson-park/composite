import RootLayout from '@/app/layout'

export default function Home() {
  return (
    <RootLayout>
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to our Mobile Web App</h1>
        <p className="mb-4">This is a simple, mobile-friendly web application built with Next.js and Tailwind CSS.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
            <p>Description of feature 1 goes here.</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Feature 2</h2>
            <p>Description of feature 2 goes here.</p>
          </div>
        </div>
      </main>
    </RootLayout>
  )
}

