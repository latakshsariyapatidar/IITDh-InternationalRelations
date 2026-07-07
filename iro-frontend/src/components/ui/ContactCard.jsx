import Card from './Card'

export default function ContactCard({ title, name, email, phone, address }) {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {name && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-semibold text-gray-900">{name}</p>
        </div>
      )}
      {email && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">Email</p>
          <a href={`mailto:${email}`} className="text-blue-700 hover:underline">
            {email}
          </a>
        </div>
      )}
      {phone && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">Phone</p>
          <a href={`tel:${phone}`} className="text-blue-700 hover:underline">
            {phone}
          </a>
        </div>
      )}
      {address && (
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <p className="text-gray-900">{address}</p>
        </div>
      )}
    </Card>
  )
}
