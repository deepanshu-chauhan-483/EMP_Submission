
import { useEffect, useState } from "react"
import { fetchEvents } from "../services/api"
import EventCard from "../components/EventCard"
import Navbar from "../components/Navbar"

const Dashboard = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    const getEvents = async () => {
      try {
        const { data } = await fetchEvents()
        setEvents(data)
        setFilteredEvents(data)
        const uniqueCategories = [...new Set(data.map((event) => event.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching events", error)
      }
    }
    getEvents()
  }, [])

  useEffect(() => {
    let filtered = events
    if (selectedCategory) {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }
    if (dateFilter) {
      const today = new Date()
      if (dateFilter === "upcoming") {
        filtered = filtered.filter((event) => new Date(event.date) >= today)
      } else if (dateFilter === "past") {
        filtered = filtered.filter((event) => new Date(event.date) < today)
      }
    }
    setFilteredEvents(filtered)
  }, [events, selectedCategory, dateFilter])

  const upcomingEvents = filteredEvents.filter((event) => new Date(event.date) >= new Date())
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < new Date())

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Dashboard</h2>

        <div className="mb-6 flex flex-wrap gap-4">
          <select
            className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </select>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          {upcomingEvents.length === 0 && <p className="text-gray-600">No upcoming events found.</p>}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          {pastEvents.length === 0 && <p className="text-gray-600">No past events found.</p>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

