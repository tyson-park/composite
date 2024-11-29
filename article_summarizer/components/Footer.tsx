import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-200 p-4 mt-8">
      <div className="container mx-auto text-center">
        <nav>
          <ul className="flex justify-center space-x-4">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </nav>
        <p className="mt-2">&copy; 2023 Mobile Web App. All rights reserved.</p>
      </div>
    </footer>
  )
}