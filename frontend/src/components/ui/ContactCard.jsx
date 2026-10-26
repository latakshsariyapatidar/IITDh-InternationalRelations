import Card from './Card'

export default function ContactCard({ title, name, email, phone, address }) {
  return (
    <Card>
      <h3 className="text-xl font-medium text-plum-deep mb-4">{title}</h3>
      <dl className="space-y-3 text-sm">
        {name && (
          <div>
            <dt className="text-quiet">Name</dt>
            <dd className="font-semibold text-plum-deep">{name}</dd>
          </div>
        )}
        {email && (
          <div>
            <dt className="text-quiet">Email</dt>
            <dd><a href={`mailto:${email}`} className="text-plum underline decoration-saffron/60 underline-offset-4 hover:decoration-plum">{email}</a></dd>
          </div>
        )}
        {phone && (
          <div>
            <dt className="text-quiet">Phone</dt>
            <dd><a href={`tel:${phone}`} className="text-plum underline decoration-saffron/60 underline-offset-4 hover:decoration-plum">{phone}</a></dd>
          </div>
        )}
        {address && (
          <div>
            <dt className="text-quiet">Address</dt>
            <dd className="text-body">{address}</dd>
          </div>
        )}
      </dl>
    </Card>
  )
}
