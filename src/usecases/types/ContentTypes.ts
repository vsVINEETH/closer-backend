export type VoteUpdateOptions = {
  addToSet?: Record<string, string>;
  pull?: Record<string, string>;
};

export type SharesUpdateOptions = {
    addToSet?: Record<string, string>
}

export type FilterMatchType = {
    createdAt?: { $gte: Date; $lte: Date };
    status?: string;
    category?: string;
};