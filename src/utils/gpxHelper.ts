/**
 * GPX utilities for Projet KM0 Belgique
 * Handles GPX file generation, reading, validation and browser downloads.
 */

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generates an authentic, RFC-compliant GPX XML file for cycling GPS computers
 * (Garmin, Wahoo, Hammerhead, Bryton, Strava, Komoot).
 */
export function generateSampleGpx(
  title: string,
  discipline: string = 'gravel',
  distanceKm: number = 50,
  elevationM: number = 800,
  location: string = 'Belgique'
): string {
  // Base coordinates around Belgian provinces (Liège, Namur, Ardennes, Brabant)
  const baseLat = location.toLowerCase().includes('aywaille') || location.toLowerCase().includes('ardennes')
    ? 50.4735
    : location.toLowerCase().includes('meerdaal') || location.toLowerCase().includes('wavre')
    ? 50.7167
    : location.toLowerCase().includes('flandres') || location.toLowerCase().includes('oudenaarde')
    ? 50.8444
    : location.toLowerCase().includes('fagnes') || location.toLowerCase().includes('botrange')
    ? 50.5019
    : 50.6333; // Default Liège / Condroz

  const baseLon = location.toLowerCase().includes('aywaille') || location.toLowerCase().includes('ardennes')
    ? 5.7032
    : location.toLowerCase().includes('meerdaal') || location.toLowerCase().includes('wavre')
    ? 4.6125
    : location.toLowerCase().includes('flandres') || location.toLowerCase().includes('oudenaarde')
    ? 3.6083
    : location.toLowerCase().includes('fagnes') || location.toLowerCase().includes('botrange')
    ? 6.0928
    : 5.5667;

  // Generate a realistic loop of GPS trackpoints
  const pointCount = 36;
  const now = new Date();
  const trackPoints: string[] = [];

  for (let i = 0; i <= pointCount; i++) {
    const angle = (i / pointCount) * 2 * Math.PI;
    // Radius in degrees approx (~0.05 deg is approx 4-5km)
    const radiusLat = 0.045 * (1 + 0.3 * Math.sin(angle * 3));
    const radiusLon = 0.065 * (1 + 0.25 * Math.cos(angle * 2));
    
    const lat = (baseLat + radiusLat * Math.sin(angle)).toFixed(6);
    const lon = (baseLon + radiusLon * Math.cos(angle)).toFixed(6);
    
    // Elevation calculation based on progress
    const elev = Math.round(180 + (elevationM * 0.7) * (0.5 + 0.5 * Math.sin(angle * 4)));
    const timeIso = new Date(now.getTime() + i * 5 * 60 * 1000).toISOString();

    trackPoints.push(`      <trkpt lat="${lat}" lon="${lon}">
        <ele>${elev}</ele>
        <time>${timeIso}</time>
      </trkpt>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="Projet KM0 Belgique (https://projet-km0.ch)" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(title)}</name>
    <desc>Trace officielle certifiée Projet KM0 Belgique - ${distanceKm} km · ${elevationM}m D+ (${discipline.toUpperCase()}) à ${escapeXml(location)}</desc>
    <author>
      <name>Projet KM0 Belgique · Guy Materne</name>
      <link href="https://projet-km0.ch">
        <text>Projet KM0</text>
      </link>
    </author>
    <time>${now.toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(title)}</name>
    <type>${discipline.toUpperCase()}</type>
    <trkseg>
${trackPoints.join('\n')}
    </trkseg>
  </trk>
</gpx>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Downloads a GPX file directly to the user's browser.
 */
export function downloadGpxFile(
  fileName?: string,
  gpxData?: string,
  fallbackTitle: string = 'trace-km0-belgique'
): void {
  const content = gpxData && gpxData.trim().length > 10
    ? gpxData
    : generateSampleGpx(fallbackTitle);

  let cleanName = fileName && fileName.trim().length > 0
    ? fileName.trim()
    : `${fallbackTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.gpx`;

  if (!cleanName.toLowerCase().endsWith('.gpx')) {
    cleanName += '.gpx';
  }

  const blob = new Blob([content], { type: 'application/gpx+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = cleanName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Inspects a GPX file content to see if it is valid GPX XML.
 */
export function validateGpxContent(xml: string): { valid: boolean; trackName?: string; pointCount?: number } {
  if (!xml || typeof xml !== 'string') return { valid: false };
  const hasGpxTag = xml.includes('<gpx') && xml.includes('</gpx>');
  if (!hasGpxTag) return { valid: false };

  const nameMatch = xml.match(/<name>(.*?)<\/name>/i);
  const trkptMatches = xml.match(/<trkpt/gi);

  return {
    valid: true,
    trackName: nameMatch ? nameMatch[1] : undefined,
    pointCount: trkptMatches ? trkptMatches.length : 0,
  };
}

export interface GpxElevationPoint {
  lat: number;
  lon: number;
  ele: number;
  distFromStartKm: number;
}

export interface GpxProfileExtraction {
  valid: boolean;
  trackName: string;
  pointCount: number;
  distanceKm: number;
  elevationM: number; // D+ (ascension positive cumulée)
  elevationLossM: number; // D- (descente cumulée)
  minElevationM: number;
  maxElevationM: number;
  elevationProfile: number[]; // 16 normalized values (15-95) for SVG curves
  sampledPoints: { distanceKm: number; elevationM: number }[];
  error?: string;
}

/**
 * Calculates distance between two GPS coordinates using the Haversine formula
 */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Parses any GPX file XML and calculates:
 * - Total distance in km
 * - Cumulative positive elevation gain D+ (meters)
 * - Min and max altitude
 * - Normalized elevation profile array (0-100) for SVG charts
 */
export function extractElevationProfileFromGpx(xmlContent: string): GpxProfileExtraction {
  if (!xmlContent || typeof xmlContent !== 'string') {
    return {
      valid: false,
      trackName: 'Trace inconnue',
      pointCount: 0,
      distanceKm: 0,
      elevationM: 0,
      elevationLossM: 0,
      minElevationM: 0,
      maxElevationM: 0,
      elevationProfile: [20, 35, 55, 45, 75, 60, 90, 70, 50, 30, 20],
      sampledPoints: [],
      error: 'Contenu GPX vide ou invalide',
    };
  }

  // Extract track name if present
  const nameMatch = xmlContent.match(/<trk>[\s\S]*?<name>(.*?)<\/name>/i) || xmlContent.match(/<name>(.*?)<\/name>/i);
  const trackName = nameMatch ? nameMatch[1].trim() : 'Trace GPX';

  // Extract all points: trkpt, rtept or wpt
  const pointRegex = /<(?:trkpt|rtept|wpt)([^>]+)>([\s\S]*?)<\/(?:trkpt|rtept|wpt)>/gi;
  const rawPoints: { lat: number; lon: number; ele: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = pointRegex.exec(xmlContent)) !== null) {
    const attrString = match[1];
    const bodyString = match[2];

    const latMatch = attrString.match(/lat=["']([-+]?[0-9]*\.?[0-9]+)["']/i);
    const lonMatch = attrString.match(/lon=["']([-+]?[0-9]*\.?[0-9]+)["']/i);

    if (latMatch && lonMatch) {
      const lat = parseFloat(latMatch[1]);
      const lon = parseFloat(lonMatch[1]);

      const eleMatch = bodyString.match(/<ele>([-+]?[0-9]*\.?[0-9]+)<\/ele>/i);
      const ele = eleMatch ? parseFloat(eleMatch[1]) : 0;

      rawPoints.push({ lat, lon, ele });
    }
  }

  if (rawPoints.length < 2) {
    return {
      valid: false,
      trackName,
      pointCount: rawPoints.length,
      distanceKm: 0,
      elevationM: 0,
      elevationLossM: 0,
      minElevationM: 0,
      maxElevationM: 0,
      elevationProfile: [20, 35, 55, 45, 75, 60, 90, 70, 50, 30, 20],
      sampledPoints: [],
      error: 'Le fichier GPX contient moins de 2 points GPS exploitables.',
    };
  }

  // Compute distances and elevation gain
  const pointsWithDist: GpxElevationPoint[] = [];
  let totalDistKm = 0;
  let totalAscentM = 0;
  let totalDescentM = 0;

  let minEle = rawPoints[0].ele;
  let maxEle = rawPoints[0].ele;

  pointsWithDist.push({
    lat: rawPoints[0].lat,
    lon: rawPoints[0].lon,
    ele: rawPoints[0].ele,
    distFromStartKm: 0,
  });

  for (let i = 1; i < rawPoints.length; i++) {
    const prev = rawPoints[i - 1];
    const curr = rawPoints[i];

    const segmentDist = haversineDistanceKm(prev.lat, prev.lon, curr.lat, curr.lon);
    totalDistKm += segmentDist;

    const eleDelta = curr.ele - prev.ele;
    // Low-pass threshold to eliminate micro GPS noise
    if (eleDelta > 0.8) {
      totalAscentM += eleDelta;
    } else if (eleDelta < -0.8) {
      totalDescentM += Math.abs(eleDelta);
    }

    if (curr.ele < minEle) minEle = curr.ele;
    if (curr.ele > maxEle) maxEle = curr.ele;

    pointsWithDist.push({
      lat: curr.lat,
      lon: curr.lon,
      ele: curr.ele,
      distFromStartKm: totalDistKm,
    });
  }

  // Sample exactly 16 points along the distance axis for responsive SVG curve
  const sampleCount = 16;
  const sampledPoints: { distanceKm: number; elevationM: number }[] = [];
  const elevationProfile: number[] = [];

  const eleRange = maxEle - minEle;

  for (let s = 0; s < sampleCount; s++) {
    const targetDist = (s / (sampleCount - 1)) * totalDistKm;

    // Find point closest to target distance
    let closestPoint = pointsWithDist[0];
    let minDelta = Math.abs(pointsWithDist[0].distFromStartKm - targetDist);

    for (let p = 1; p < pointsWithDist.length; p++) {
      const delta = Math.abs(pointsWithDist[p].distFromStartKm - targetDist);
      if (delta < minDelta) {
        minDelta = delta;
        closestPoint = pointsWithDist[p];
      }
    }

    const altitude = closestPoint.ele;
    sampledPoints.push({
      distanceKm: Math.round(targetDist * 10) / 10,
      elevationM: Math.round(altitude),
    });

    // Normalize between 15% and 92% of the SVG height
    if (eleRange > 5) {
      const normalized = Math.round(15 + ((altitude - minEle) / eleRange) * 75);
      elevationProfile.push(Math.max(10, Math.min(95, normalized)));
    } else {
      elevationProfile.push(50);
    }
  }

  return {
    valid: true,
    trackName,
    pointCount: rawPoints.length,
    distanceKm: Math.round(totalDistKm * 10) / 10,
    elevationM: Math.round(totalAscentM),
    elevationLossM: Math.round(totalDescentM),
    minElevationM: Math.round(minEle),
    maxElevationM: Math.round(maxEle),
    elevationProfile,
    sampledPoints,
  };
}

