import { revalidatePath } from 'next/cache'
import db from '../lib/db'

export async function addItem(formData) {
  'use server'
  createItem(formData.get('title'))
  revalidatePath('/')
}

const createItem = async (title: string): Promise<number> => {
    if (!title) {
        throw new Error("Title is required");
    }

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(
                `
                    INSERT INTO items (title) VALUES ($title)
                `,
                {
                    $title: title
                },
                function(err) {
                    if (err) {
                        reject(err);
                    }

                    resolve(this.lastID);
                }
            )
        })
    })
}

export default async function Page() {
  const items = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })

  return (
    <div>
      <form action={addItem}>
        <input name="title" placeholder="Enter title" required />
        <button type="submit">Add</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}
