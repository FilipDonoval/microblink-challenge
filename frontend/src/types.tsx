
export interface Match {
    entropy: number;
    length: number;
    string: string;
}

export interface DetectorDetails {
    matches: Match[];
    matches_count: number;
    passed: boolean;
}

export interface Finding {
    filename: string;
    detectors?: Record<string, DetectorDetails>;
    has_secrets?: boolean;
    error?: string;
}

export interface LlmAnalysis {
    message?: string;
    error?: string;
}

export interface Summary {
    files_with_errors: number;
    files_with_secrets: number;
    total_files_scanned: number;
}

export interface ScanResponse {
    all_results: Finding[];
    findings: Finding[];
    llm_analysis: LlmAnalysis;
    repo_url: string;
    summary: Summary;
}

