const CleanupsService = {
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

module.exports = CleanupsService;