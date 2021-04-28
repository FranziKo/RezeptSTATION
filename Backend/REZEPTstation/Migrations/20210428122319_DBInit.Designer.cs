﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using REZEPTstation.Data;

namespace REZEPTstation.Migrations
{
    [DbContext(typeof(REZEPTstationContext))]
    [Migration("20210428122319_DBInit")]
    partial class DBInit
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 64)
                .HasAnnotation("ProductVersion", "5.0.5");

            modelBuilder.Entity("REZEPTstation.Models.AssignCategories", b =>
                {
                    b.Property<int>("AssignCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("CategoryID")
                        .HasColumnType("int");

                    b.Property<int>("RecipeID")
                        .HasColumnType("int");

                    b.HasKey("AssignCategoryId");

                    b.HasIndex("CategoryID");

                    b.HasIndex("RecipeID");

                    b.ToTable("AssignCategories");
                });

            modelBuilder.Entity("REZEPTstation.Models.Categories", b =>
                {
                    b.Property<int>("CategoryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("CategoryID");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("REZEPTstation.Models.Favorites", b =>
                {
                    b.Property<int>("FavoriteID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("RecipeID")
                        .HasColumnType("int");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("FavoriteID");

                    b.HasIndex("RecipeID");

                    b.HasIndex("UserID");

                    b.ToTable("Favorites");
                });

            modelBuilder.Entity("REZEPTstation.Models.Friends", b =>
                {
                    b.Property<int>("FriendsID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("UserID1")
                        .HasColumnType("int");

                    b.Property<int>("UserID2")
                        .HasColumnType("int");

                    b.HasKey("FriendsID");

                    b.HasIndex("UserID1");

                    b.HasIndex("UserID2");

                    b.ToTable("Friends");
                });

            modelBuilder.Entity("REZEPTstation.Models.FriendsRequest", b =>
                {
                    b.Property<int>("RequestID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("UserID1")
                        .HasColumnType("int");

                    b.Property<int>("UserID2")
                        .HasColumnType("int");

                    b.HasKey("RequestID");

                    b.HasIndex("UserID1");

                    b.HasIndex("UserID2");

                    b.ToTable("FriendsRequest");
                });

            modelBuilder.Entity("REZEPTstation.Models.Ingredients", b =>
                {
                    b.Property<int>("IngredientID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("RecipeID")
                        .HasColumnType("int");

                    b.HasKey("IngredientID");

                    b.HasIndex("RecipeID");

                    b.ToTable("Ingredients");
                });

            modelBuilder.Entity("REZEPTstation.Models.Rating", b =>
                {
                    b.Property<int>("RatingID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("RecipeID")
                        .HasColumnType("int");

                    b.Property<int>("Score")
                        .HasColumnType("int");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("RatingID");

                    b.HasIndex("RecipeID");

                    b.HasIndex("UserID");

                    b.ToTable("Rating");
                });

            modelBuilder.Entity("REZEPTstation.Models.Recipe", b =>
                {
                    b.Property<int>("RecipeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Difficulty")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("Duration")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.Property<bool>("Visible")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("RecipeID");

                    b.HasIndex("UserID");

                    b.ToTable("Recipe");
                });

            modelBuilder.Entity("REZEPTstation.Models.Steps", b =>
                {
                    b.Property<int>("StepID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("Number")
                        .HasColumnType("int");

                    b.Property<int>("RecipeID")
                        .HasColumnType("int");

                    b.Property<string>("describtion")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("StepID");

                    b.HasIndex("RecipeID");

                    b.ToTable("Steps");
                });

            modelBuilder.Entity("REZEPTstation.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("UserID");

                    b.ToTable("User");
                });

            modelBuilder.Entity("REZEPTstation.Models.AssignCategories", b =>
                {
                    b.HasOne("REZEPTstation.Models.Categories", null)
                        .WithMany()
                        .HasForeignKey("CategoryID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("REZEPTstation.Models.Recipe", null)
                        .WithMany()
                        .HasForeignKey("RecipeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.Favorites", b =>
                {
                    b.HasOne("REZEPTstation.Models.Recipe", null)
                        .WithMany()
                        .HasForeignKey("RecipeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("REZEPTstation.Models.Recipe", null)
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.Friends", b =>
                {
                    b.HasOne("REZEPTstation.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserID1")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("REZEPTstation.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserID2")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.FriendsRequest", b =>
                {
                    b.HasOne("REZEPTstation.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserID1")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("REZEPTstation.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserID2")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.Ingredients", b =>
                {
                    b.HasOne("REZEPTstation.Models.Recipe", null)
                        .WithMany()
                        .HasForeignKey("RecipeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.Rating", b =>
                {
                    b.HasOne("REZEPTstation.Models.Recipe", null)
                        .WithMany()
                        .HasForeignKey("RecipeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("REZEPTstation.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.Recipe", b =>
                {
                    b.HasOne("REZEPTstation.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("REZEPTstation.Models.Steps", b =>
                {
                    b.HasOne("REZEPTstation.Models.Recipe", null)
                        .WithMany()
                        .HasForeignKey("RecipeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}