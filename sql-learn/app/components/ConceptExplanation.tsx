"use client";

export interface ConceptExplanationData {
  skill: string;
  explanation: string;
  keyInsight: string;
  relatedSkills?: string[];
}

interface ConceptExplanationProps {
  concept: ConceptExplanationData;
}

export default function ConceptExplanation({ concept }: ConceptExplanationProps) {
  return (
    <div className="space-y-4">
      {/* Skill Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{concept.skill}</h2>
          <p className="text-xs text-gray-500">Skill Focus</p>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {concept.explanation}
      </p>

      {/* Key Insight */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Key Insight</span>
        <p className="text-gray-800 text-sm mt-1 italic">
          &ldquo;{concept.keyInsight}&rdquo;
        </p>
      </div>

      {/* Related Skills */}
      {concept.relatedSkills && concept.relatedSkills.length > 0 && (
        <div className="pt-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Also practices:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {concept.relatedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
