const OverviewService = {
    getWorld(db) {
        return db
            .sum('quantity')
            .from('cleanups')
    },
    getTop(db) {
        return db
            .select('country_name')
            .sum('quantity')
            .from('cleanups')
            .join('region', 'cleanups.location', 'region.id')
            .join('countries', 'country', 'countries.id')
            .groupBy('country_name')
            .orderBy('sum', 'desc')
            .limit(5)
    },
    getCountry(db, country) {
        return db
            .sum('quantity')
            .from('cleanups')
            .join('region', 'cleanups.location', 'region.id')
            .join('countries', 'country', 'countries.id')
            .where('country_name', '=', country)
            .groupBy('country_name')
    },
    getRegion(db, country, region) {
        return db
            .sum('quantity')
            .from('cleanups')
            .join('region', 'cleanups.location', 'region.id')
            .join('countries', 'country', 'countries.id')
            .where('country_name', '=', country)
            .andWhere('region_name', '=', region)
            .groupBy('country_name')
    },
    getCleanups(db, user_id) {
      return db
        .select(
          'region_name',
          'date',
          'type_of_trash',
          'quantity',
        )
        .from(
            'cleanups'
        )
        .join(
            'region', 'region.id', 'cleanups.location',
            )
        .where(
            'user_name', user_id 
        )
    },
    insertCleanup(db, insert) {
        return db  
            .insert(
                insert
            )
            .into('cleanups')
            .returning('*')
            .then(([region_name]) => region_name)
    }

};

module.exports = OverviewService;