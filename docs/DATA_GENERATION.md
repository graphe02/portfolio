# Static Data Generation

This project uses static data generation to populate content at build time, providing better performance and SEO benefits.

## How It Works

The data generation system works in multiple ways:

1. **Build-time Generation**: Data is generated automatically before each build
2. **Manual Generation**: You can manually regenerate data using npm scripts
3. **Category-specific Grabbers**: Dedicated scripts for specific content types

## Data Structure

The system uses separate JSON files for each content category:

```
src/lib/
├── guitar-data.json     # Guitar videos (guitarItem[])
├── coding-data.json     # Coding projects (ProjectItem[])
├── gaming-data.json     # Gaming videos (gamingItem[])
└── tablatures/          # Individual tablature files
```

## Data Sources

The system can pull data from multiple sources:

### Static Data
- Manual entries in individual JSON files
- Easy to modify and maintain

### RSS Feeds
- YouTube RSS feeds (supports both RSS and Atom formats)
- Automatic categorization and deduplication

### External APIs
- YouTube API (optional) - requires `YOUTUBE_API_KEY` environment variable
- Can fetch video titles, descriptions, and metadata

## Usage

### General Data Generation
Generate all data at once:

```bash
npm run generate-data
```

This will:
1. Read existing data from separate JSON files
2. Fetch RSS feeds and categorize content
3. Update all JSON files
4. Build the Next.js application

### Gaming RSS Grabber
Dedicated script for gaming content:

```bash
npm run grab-gaming
```

This will:
1. Read existing `gaming-data.json`
2. Fetch from configured gaming RSS feeds
3. Parse YouTube Atom format feeds
4. Add new gaming videos (avoiding duplicates)
5. Write updated data to `gaming-data.json`

### Development
For development, you can regenerate data as needed:

```bash
npm run grab-gaming    # Update gaming content
npm run generate-data  # Update all content
npm run dev           # Start development server
```

## Configuration

### Environment Variables
Add to your `.env.local` file:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### RSS Feed Configuration

#### Gaming RSS Feeds
Edit `scripts/grab-gaming-rss.js`:

```javascript
const GAMING_RSS_FEEDS = [
  "https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID",
  "https://www.youtube.com/feeds/videos.xml?user=GamingUsername"
];
```

#### General RSS Feeds
Edit `scripts/generate-data.js` to add more RSS feeds for all categories.

### Customizing Data Sources
Edit the respective scripts to:

1. **Add more RSS feeds**:
   ```javascript
   const RSS_FEEDS = [
     'https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID'
   ];
   ```

2. **Add new data sources**:
   ```javascript
   // Example: Reading from markdown files
   const markdownFiles = fs.readdirSync('./content/projects');
   const projects = markdownFiles.map(file => {
     // Parse markdown and extract data
   });
   ```

3. **Add API integrations**:
   ```javascript
   // Example: GitHub API for projects
   const githubProjects = await fetchGitHubProjects();
   ```

## File Structure

```
src/
├── lib/
│   ├── guitar-data.json          # Generated guitar data
│   ├── coding-data.json          # Generated coding data
│   ├── gaming-data.json          # Generated gaming data
│   ├── data.ts                   # Data interfaces and exports
│   └── tablatures/               # Individual tablature files
├── app/
│   └── showcase/
│       └── page.tsx              # Uses static data
└── components/
    └── video-card.tsx            # Displays generated data

scripts/
├── generate-data.js              # General data generation
└── grab-gaming-rss.js           # Gaming-specific RSS grabber
```

## Benefits

1. **Performance**: No runtime data fetching
2. **SEO**: Search engines can see all content immediately
3. **Reliability**: No dependency on external APIs during runtime
4. **Caching**: Static data can be cached effectively
5. **Flexibility**: Easy to add new data sources
6. **Organization**: Separate files for each content type
7. **Deduplication**: Smart merging prevents duplicate content

## Adding New Content Types

To add a new content type (e.g., blog posts):

1. **Create new JSON file**:
   ```bash
   touch src/lib/blog-data.json
   ```

2. **Update interfaces** in `src/lib/data.ts`:
   ```typescript
   export interface BlogPost {
     id: string;
     title: string;
     content: string;
     publishedAt: string;
   }
   ```

3. **Add import and export**:
   ```typescript
   import blogData from './blog-data.json';
   export const blogPosts: BlogPost[] = blogData;
   ```

4. **Create dedicated grabber** (optional):
   ```bash
   touch scripts/grab-blog-rss.js
   ```

5. **Use in components**:
   ```typescript
   import { blogPosts } from '@/lib/data';
   ```

## Troubleshooting

### Data not updating
- Clear the `.next` cache: `rm -rf .next`
- Regenerate data: `npm run generate-data` or `npm run grab-gaming`
- Restart the dev server: `npm run dev`

### RSS feed issues
- Check RSS feed URL is correct
- Verify the feed is publicly accessible
- Check for CORS issues (use server-side fetching)

### YouTube API errors
- Check your API key is valid
- Ensure the API key has YouTube Data API v3 enabled
- Check API quota limits

### Build errors
- Ensure all required files exist
- Check TypeScript types match
- Verify JSON syntax is valid

## Scripts Reference

| Script | Purpose | Output |
|--------|---------|--------|
| `npm run generate-data` | Generate all data from RSS feeds | Updates all JSON files |
| `npm run grab-gaming` | Grab gaming content only | Updates `gaming-data.json` |
| `npm run build` | Build with data generation | Runs generate-data + build | 