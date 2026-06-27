import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 5,
  min: 0,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
  statement_timeout: 10000,
  query_timeout: 10000,
};

let pool: Pool;

function createPool(): Pool {
  if (pool) return pool;

  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
  });

  pool.on('connect', () => {
    console.log('PostgreSQL client connected');
  });

  return pool;
}

const dbPool = createPool();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  cover_image?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  nom: string;
  email: string;
  tel?: string;
  objet: string;
  content: string;
  created_at: string;
}

// ─── Query helper with retry ──────────────────────────────────────────────────

async function executeQuery<T>(
  queryFn: (client: import('pg').PoolClient) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const client = await dbPool.connect();
    try {
      return await queryFn(client);
    } catch (error) {
      lastError = error;
      console.error(`Query attempt ${attempt + 1} failed:`, (error as Error).message);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    } finally {
      client.release();
    }
  }

  throw lastError;
}

// ─── Courses ─────────────────────────────────────────────────────────────────

/** Tous les cours publiés (usage public) */
export async function getCourses(): Promise<Course[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM courses WHERE is_published = true ORDER BY created_at DESC'
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

/** Tous les cours, publiés ou non (usage admin) */
export async function getAllCourses(): Promise<Course[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM courses ORDER BY created_at DESC'
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching all courses:', error);
    return [];
  }
}

/** Cours publié par slug (usage public) */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM courses WHERE slug = $1 AND is_published = true LIMIT 1',
        [slug]
      );
      return result.rows[0] ?? null;
    });
  } catch (error) {
    console.error('Error fetching course by slug:', slug, error);
    return null;
  }
}

/** Cours par slug sans filtre is_published (usage admin) */
export async function getCourseBySlugAdmin(slug: string): Promise<Course | null> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM courses WHERE slug = $1 LIMIT 1',
        [slug]
      );
      return result.rows[0] ?? null;
    });
  } catch (error) {
    console.error('Error fetching course by slug (admin):', slug, error);
    return null;
  }
}

export async function createCourse(
  data: Omit<Course, 'id' | 'created_at' | 'updated_at'>
): Promise<Course> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `INSERT INTO courses (title, slug, description, category, cover_image, is_published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.title, data.slug, data.description, data.category, data.cover_image, data.is_published]
    );
    return result.rows[0];
  });
}

export async function updateCourse(
  slug: string,
  data: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>
): Promise<Course | null> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `UPDATE courses
       SET title        = COALESCE($1, title),
           slug         = COALESCE($2, slug),
           description  = COALESCE($3, description),
           category     = COALESCE($4, category),
           cover_image  = COALESCE($5, cover_image),
           is_published = COALESCE($6, is_published),
           updated_at   = NOW()
       WHERE slug = $7
       RETURNING *`,
      [data.title, data.slug, data.description, data.category, data.cover_image, data.is_published, slug]
    );
    return result.rows[0] ?? null;
  });
}

export async function deleteCourseBySlug(slug: string): Promise<boolean> {
  return await executeQuery(async (client) => {
    await client.query(
      'DELETE FROM notes WHERE course_id = (SELECT id FROM courses WHERE slug = $1)',
      [slug]
    );
    const result = await client.query(
      'DELETE FROM courses WHERE slug = $1 RETURNING id',
      [slug]
    );
    return (result.rowCount ?? 0) > 0;
  });
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function getNotesByCourseId(courseId: string): Promise<Note[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM notes WHERE course_id = $1 AND is_published = true ORDER BY order_index ASC',
        [courseId]
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching notes by course ID:', courseId, error);
    return [];
  }
}

/** Notes par slug de cours (publiées uniquement) */
export async function getNotesByCourseSlug(courseSlug: string): Promise<Note[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        `SELECT n.* FROM notes n
         JOIN courses c ON c.id = n.course_id
         WHERE c.slug = $1 AND n.is_published = true
         ORDER BY n.order_index ASC`,
        [courseSlug]
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching notes by course slug:', courseSlug, error);
    return [];
  }
}

/** Toutes les notes d'un cours par slug (admin) */
export async function getAllNotesByCourseSlug(courseSlug: string): Promise<Note[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        `SELECT n.* FROM notes n
         JOIN courses c ON c.id = n.course_id
         WHERE c.slug = $1
         ORDER BY n.order_index ASC`,
        [courseSlug]
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching all notes by course slug:', courseSlug, error);
    return [];
  }
}

export async function getNoteBySlug(courseId: string, slug: string): Promise<Note | null> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM notes WHERE course_id = $1 AND slug = $2 AND is_published = true LIMIT 1',
        [courseId, slug]
      );
      return result.rows[0] ?? null;
    });
  } catch (error) {
    console.error('Error fetching note by slug:', slug, error);
    return null;
  }
}

export async function getNoteById(id: string): Promise<Note | null> {
  return await executeQuery(async (client) => {
    const result = await client.query('SELECT * FROM notes WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  });
}

export async function createNote(
  data: Omit<Note, 'id' | 'created_at' | 'updated_at'>
): Promise<Note> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `INSERT INTO notes (course_id, title, slug, content, order_index, is_published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.course_id, data.title, data.slug, data.content, data.order_index, data.is_published]
    );
    return result.rows[0];
  });
}

export async function updateNote(
  id: string,
  data: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>
): Promise<Note | null> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `UPDATE notes
       SET title       = COALESCE($1, title),
           slug        = COALESCE($2, slug),
           content     = COALESCE($3, content),
           order_index = COALESCE($4, order_index),
           is_published = COALESCE($5, is_published),
           updated_at  = NOW()
       WHERE id = $6
       RETURNING *`,
      [data.title, data.slug, data.content, data.order_index, data.is_published, id]
    );
    return result.rows[0] ?? null;
  });
}

export async function deleteNote(id: string): Promise<boolean> {
  return await executeQuery(async (client) => {
    const result = await client.query('DELETE FROM notes WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount ?? 0) > 0;
  });
}

export async function getAdjacentNotes(courseId: string, currentOrderIndex: number) {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM notes WHERE course_id = $1 AND is_published = true ORDER BY order_index ASC',
        [courseId]
      );
      const notes: Note[] = result.rows;
      const idx = notes.findIndex((n) => n.order_index === currentOrderIndex);
      return {
        prev: idx > 0 ? notes[idx - 1] : null,
        next: idx < notes.length - 1 ? notes[idx + 1] : null,
      };
    });
  } catch (error) {
    console.error('Error fetching adjacent notes:', error);
    return { prev: null, next: null };
  }
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages(): Promise<Message[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query('SELECT * FROM messages ORDER BY created_at DESC');
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function createMessage(
  data: Omit<Message, 'id' | 'created_at'>
): Promise<Message> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `INSERT INTO messages (nom, email, tel, objet, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.nom, data.email, data.tel, data.objet, data.content]
    );
    return result.rows[0];
  });
}

// ─── Pool ─────────────────────────────────────────────────────────────────────

export async function closePool(): Promise<void> {
  if (pool) await pool.end();
}

export default dbPool;
// ─── Projects ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  cover_image?: string;
  is_featured: boolean;
  is_published: boolean;
  year?: string;
  status?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getProjects(): Promise<Project[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM projects WHERE is_published = true ORDER BY sort_order ASC, created_at DESC'
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    return await executeQuery(async (client) => {
      const result = await client.query(
        'SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC'
      );
      return result.rows;
    });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

export async function createProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `INSERT INTO projects (title, slug, description, category, technologies,
        github_url, live_url, cover_image, is_featured, is_published, year, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [data.title, data.slug, data.description, data.category, data.technologies,
       data.github_url, data.live_url, data.cover_image, data.is_featured,
       data.is_published, data.year, data.status, data.sort_order]
    );
    return result.rows[0];
  });
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
): Promise<Project | null> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      `UPDATE projects SET
        title        = COALESCE($1, title),
        slug         = COALESCE($2, slug),
        description  = COALESCE($3, description),
        category     = COALESCE($4, category),
        technologies = COALESCE($5, technologies),
        github_url   = COALESCE($6, github_url),
        live_url     = COALESCE($7, live_url),
        cover_image  = COALESCE($8, cover_image),
        is_featured  = COALESCE($9, is_featured),
        is_published = COALESCE($10, is_published),
        year         = COALESCE($11, year),
        status       = COALESCE($12, status),
        sort_order   = COALESCE($13, sort_order),
        updated_at   = NOW()
       WHERE id = $14 RETURNING *`,
      [data.title, data.slug, data.description, data.category, data.technologies,
       data.github_url, data.live_url, data.cover_image, data.is_featured,
       data.is_published, data.year, data.status, data.sort_order, id]
    );
    return result.rows[0] ?? null;
  });
}

export async function deleteProject(id: string): Promise<boolean> {
  return await executeQuery(async (client) => {
    const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount ?? 0) > 0;
  });
}

// ─── Admin Auth ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      'SELECT * FROM admin_users WHERE username = $1 AND is_active = true LIMIT 1',
      [username]
    );
    return result.rows[0] ?? null;
  });
}

export async function createAdminSession(userId: string, token: string, expiresAt: Date): Promise<void> {
  await executeQuery(async (client) => {
    await client.query(
      'INSERT INTO admin_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
    await client.query(
      'UPDATE admin_users SET last_login_at = NOW() WHERE id = $1',
      [userId]
    );
  });
}

export async function getAdminSession(token: string): Promise<{ user_id: string } | null> {
  return await executeQuery(async (client) => {
    const result = await client.query(
      'SELECT user_id FROM admin_sessions WHERE token = $1 AND expires_at > NOW() LIMIT 1',
      [token]
    );
    return result.rows[0] ?? null;
  });
}

export async function deleteAdminSession(token: string): Promise<void> {
  await executeQuery(async (client) => {
    await client.query('DELETE FROM admin_sessions WHERE token = $1', [token]);
  });
}
