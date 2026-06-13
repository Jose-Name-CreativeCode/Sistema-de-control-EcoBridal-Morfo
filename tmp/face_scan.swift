import Foundation
import AppKit
import Vision

struct FaceMetric: Codable {
  let file: String
  let faceCount: Int
  let largestFaceArea: Double
}

func metrics(for imageURL: URL) -> FaceMetric? {
  guard let image = NSImage(contentsOf: imageURL) else { return nil }

  var rect = NSRect(origin: .zero, size: image.size)
  guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
    return nil
  }

  let request = VNDetectFaceRectanglesRequest()
  let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

  do {
    try handler.perform([request])
  } catch {
    return nil
  }

  let observations = request.results ?? []
  let largestArea = observations
    .map { Double($0.boundingBox.width * $0.boundingBox.height) }
    .max() ?? 0

  return FaceMetric(
    file: imageURL.lastPathComponent,
    faceCount: observations.count,
    largestFaceArea: largestArea
  )
}

guard let folder = CommandLine.arguments.dropFirst().first else {
  fputs("Usage: face_scan.swift <folder>\n", stderr)
  exit(1)
}

let folderURL = URL(fileURLWithPath: folder, isDirectory: true)
let fileManager = FileManager.default

guard let files = try? fileManager.contentsOfDirectory(at: folderURL, includingPropertiesForKeys: nil) else {
  fputs("Could not read folder\n", stderr)
  exit(1)
}

let metricsList = files
  .filter { ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) }
  .sorted { $0.lastPathComponent < $1.lastPathComponent }
  .compactMap(metrics(for:))

let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
FileHandle.standardOutput.write(try encoder.encode(metricsList))
