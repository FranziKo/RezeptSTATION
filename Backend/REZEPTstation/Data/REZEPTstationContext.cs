
using Microsoft.EntityFrameworkCore;
using REZEPTstation.Models;

namespace REZEPTstation.Data
{
    public class REZEPTstationContext: DbContext
    {
        public REZEPTstationContext(DbContextOptions<REZEPTstationContext> options): base(options)
        {
        }
        
        public DbSet<AssignCategories> AssignCategories { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Favorites> Favorites { get; set; }
        public DbSet<Friends> Friends { get; set; }
        public DbSet<FriendsRequest> FriendsRequest { get; set; }
        public DbSet<Ingredients> Ingredients { get; set; }
        public DbSet<Rating> Rating { get; set; }
        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<Steps> Steps { get; set; }
        public DbSet<User> User { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AssignCategories>().ToTable("AssignCategories");
            modelBuilder.Entity<Categories>().ToTable("Categories");
            modelBuilder.Entity<Favorites>().ToTable("Favorites");
            modelBuilder.Entity<Friends>().ToTable("Friends");
            modelBuilder.Entity<FriendsRequest>().ToTable("FriendsRequest");
            modelBuilder.Entity<Ingredients>().ToTable("Ingredients");
            modelBuilder.Entity<Rating>().ToTable("Rating");
            modelBuilder.Entity<Recipe>().ToTable("Recipe");
            modelBuilder.Entity<Steps>().ToTable("Steps");
            modelBuilder.Entity<User>().ToTable("User");

            //Configure relationship
            modelBuilder.Entity<Friends>().HasOne<User>().WithMany().HasForeignKey(u => u.UserID1);
            modelBuilder.Entity<Friends>().HasOne<User>().WithMany().HasForeignKey(u => u.UserID2);

            modelBuilder.Entity<FriendsRequest>().HasOne<User>().WithMany().HasForeignKey(u => u.UserID1);
            modelBuilder.Entity<FriendsRequest>().HasOne<User>().WithMany().HasForeignKey(u => u.UserID2);

            modelBuilder.Entity<Rating>().HasOne<User>().WithMany().HasForeignKey(r => r.UserID);
            modelBuilder.Entity<Rating>().HasOne<Recipe>().WithMany().HasForeignKey(r => r.RecipeID);

            modelBuilder.Entity<Favorites>().HasOne<Recipe>().WithMany().HasForeignKey(f => f.UserID);
            modelBuilder.Entity<Favorites>().HasOne<Recipe>().WithMany().HasForeignKey(f => f.RecipeID);

            modelBuilder.Entity<Recipe>().HasOne<User>().WithMany().HasForeignKey(r => r.UserID);

            modelBuilder.Entity<Ingredients>().HasOne<Recipe>().WithMany().HasForeignKey(i => i.RecipeID);

            modelBuilder.Entity<Steps>().HasOne<Recipe>().WithMany().HasForeignKey(s => s.RecipeID);

            modelBuilder.Entity<AssignCategories>().HasOne<Recipe>().WithMany().HasForeignKey(a => a.RecipeID);
            modelBuilder.Entity<AssignCategories>().HasOne<Categories>().WithMany().HasForeignKey(a => a.CategoryID);

        }

    }
}
