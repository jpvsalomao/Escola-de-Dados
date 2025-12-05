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
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border-2 border-teal-200 p-6 shadow-sm">
      {/* Skill Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">Skill Focus</span>
          <h3 className="font-bold text-gray-900 text-lg">{concept.skill}</h3>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {concept.explanation}
      </p>

      {/* Key Insight - Highlighted */}
      <div className="bg-white rounded-xl p-4 border border-teal-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">Key Insight</span>
            <p className="text-gray-800 font-medium italic">
              &ldquo;{concept.keyInsight}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Related Skills */}
      {concept.relatedSkills && concept.relatedSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-teal-200">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Also practices:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {concept.relatedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
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
