# Setup

- Run `npm install`

# Usage
- Run `node csv-transform.js -csv <path/to/file.csv>`
- Or `npm start` (uses `entry.csv` by default)

# What it does
- Reads an input CSV where the first column is a grouping key.
- Splits rows into multiple output CSV files named `<key>.csv`.
- Each output row contains an empty first column, then column 2 and column 3 from the input.

# AWS Lambda (S3 upload)
- See `aws-csv-transformer.js`. Invoke with `fileUrl` query parameter pointing to a CSV file.
- Requires `BUCKET_NAME` environment variable.
- Streams parse the CSV and upload resulting per-key CSVs to S3.

# Notes
- Uses fast-csv v4 API (`parse`/`format`).
- Trims cells and ignores empty lines. Handles potential BOM on first value.
